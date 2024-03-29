import DatePicker from 'react-datepicker';
import styled, { css } from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import $ from 'jquery';
import { useState, forwardRef, useEffect, useReducer } from 'react';
import { getLocalJson } from '@/pages/api/api';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { flexRow } from './css/common';

// css
const CustomDatePicker = styled.div(
  css`
    .custom-day {
      width: 28px;
      height: 28px;
      text-align: center;
    }
    .gray-day {
      color: #aba8b9;
    }
    .selected-day {
      background: #1ddb16;
      border-radius: 50%;
      font-weight: 700;
    }
  `
);

const DateInput = {
  width: '240px',
  padding: '10px 0px',
  background: 'white',
  border: '1px solid gray',
  borderRadius: '10px',
};

const ImageBox = styled.div(
  flexRow,
  css`
    width: 100%;
    overflow-x: scroll;
    scrollbar-width: none;

    :last-child {
      margin-right: 0px;
    }

    img {
      margin-right: 10px;
    }
  `
);

// tag
const RadioButton = ({ value, name, text, onChange }) => {
  return (
    <>
      <input type="radio" value={value} name={name} id={value} onChange={() => onChange(name, value)}></input>
      <label htmlFor={value}>{text}</label>
    </>
  );
};

const DatePickerInput = forwardRef(({ value, onClick }, ref) => {
  return (
    <button style={DateInput} onClick={onClick} ref={ref}>
      {value}
    </button>
  );
});

DatePickerInput.displayName = 'DatePickerInput';

const SelectBox = ({ name, onChange }) => {
  const [list, setList] = useState({});

  useEffect(() => {
    const getList = async () => {
      const result = await getLocalJson('../../localJson.json', 'source');
      setList(result);
    };
    getList();
  }, []);

  const onChangeValue = (e) => {
    onChange('source', $(`select[name=${name}] option:selected`).val());
  };

  return (
    <select name={name} onChange={(e) => onChangeValue(e)}>
      <option key="none" value="">
        선택하기
      </option>
      {Object.keys(list).map((key) => {
        const item = list[key];
        return (
          <option key={item['content']} value={item['content']}>
            {item['title']}
          </option>
        );
      })}
    </select>
  );
};

const ImageView = ({ data }) => {
  return <Image width={100} height={100} alt="" src={data}></Image>;
};

// event
const uploadFileForm = (state, action) => {
  state = { ...state, [action.type]: action.value };
  return state;
};

const UploadGallery = () => {
  const [initState, dispatch] = useReducer(uploadFileForm, {
    date: new Date(),
    target: '',
    file_data: '',
    file_extension: '',
    source: '',
    source_url: '',
    source_account: '',
    type: '',
  });

  const [selectDate, setSelectDate] = useState(new Date());
  const [month, setMonth] = useState(new Date().getMonth());
  const [images, setImages] = useState([]);

  const handleMonthChange = (date) => {
    setMonth(date.getMonth());
  };

  const changeState = (type, value) => {
    dispatch({ type: type, value: value });
  };

  const onLoadFile = async (e) => {
    const extensions = [];
    const thumnails = [];

    let fileList = e.target.files;

    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      extensions.push(file['type']);

      const newFile = await imageCompression(fileList[i], {
        maxSizeMB: 4.5,
        maxWidthOrHeight: 3840,
      });

      const resizingFile = new File([newFile], file['type'], { type: file['type'] });

      let fileReader = new FileReader();
      fileReader.onload = () => {
        const result = fileReader.result;

        thumnails.push(result);
        changeState('file_data', [...thumnails]);
        setImages(thumnails);
      };

      fileReader.readAsDataURL(resizingFile);
    }

    changeState('file_extension', extensions);
  };

  const onSubmit = async () => {
    $('#load').css('display', 'block');
    const date = initState['date'];
    const bodyYear = date.getFullYear();
    const bodyDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`;

    const response = await fetch('/api/sheet-filter', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sheetName: bodyYear, columnId: 'date', word: bodyDate, resColumn: ['seq'] }),
    });

    const sheets = await response.json();

    let maxSeq = 0;
    Object.values(sheets.data).forEach((value) => (maxSeq = maxSeq < Number.parseInt(value['seq']) ? Number.parseInt(value['seq']) : maxSeq));

    const images = initState['file_data'];
    for (let index = 0; index < images.length; index++) {
      const imgArr = images[index].toString().match(new RegExp(`.{1,${50000}}`, 'g'));
      let fileData = {};
      imgArr.forEach((str, i) => (fileData = { ...fileData, [`file_data_${(i + 1).toString().padStart(2, '0')}`]: str }));

      const res_row = {
        ...fileData,
        date: initState['date'],
        seq: Number.parseInt(maxSeq) + index + 1,
        type: initState['type'],
        target: initState['target'],
        source: initState['source'],
        source_url: initState['source_url'],
        source_account: initState['source_account'],
        file_extension: initState['file_extension'][index],
      };

      const insertResponse = await fetch('/api/insert', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          row: res_row,
          title: bodyYear,
        }),
      });
    }
    $('#load').css('display', 'none');
  };

  return (
    <>
      <div>
        <div>
          <p>업로드 일자</p>
          <CustomDatePicker>
            <DatePicker
              selected={selectDate}
              onChange={(date) => {
                changeState('date', date);
                setSelectDate(date);
              }}
              dateFormat="yyyy-MM-dd"
              customInput={<DatePickerInput />}
              onMonthChange={handleMonthChange}
              dayClassName={(d) =>
                d.getMonth() === month
                  ? d.getDate() === selectDate.getDate() && d.getMonth() === selectDate.getMonth()
                    ? 'custom-day selected-day'
                    : 'custom-day'
                  : 'custom-day gray-day'
              }
            ></DatePicker>
          </CustomDatePicker>
        </div>
        <div>
          <p>대상</p>
          <RadioButton value="common" name="target" text="공동" onChange={changeState}></RadioButton>
          <RadioButton value="joowan" name="target" text="차주완" onChange={changeState}></RadioButton>
          <RadioButton value="taebin" name="target" text="이태빈" onChange={changeState}></RadioButton>
        </div>
        <div>
          <p>종류</p>
          <RadioButton value="image" name="type" text="이미지" onChange={changeState}></RadioButton>
          <RadioButton value="video" name="type" text="영상" onChange={changeState}></RadioButton>
        </div>
        <div>
          <p>출처</p>
          <SelectBox onChange={changeState} name="source"></SelectBox>
        </div>
        {initState['source'] !== '' && (
          <div>
            <p>출처 계정</p>
            <input style={{ width: '50%' }}></input>
          </div>
        )}
        {initState['source'] !== '' && (
          <div>
            <p>출처 URL</p>
            <input style={{ width: '100%' }}></input>
          </div>
        )}
        {initState['type'] !== '' && (
          <div>
            <p>{initState['type'] === 'image' ? '이미지' : '썸네일'}</p>
            <label style={{ cursor: 'pointer' }} htmlFor="fileImage">
              선택하기
            </label>
            <input id="fileImage" style={{ display: 'none' }} type="file" onChange={onLoadFile} multiple></input>
          </div>
        )}
        <ImageBox>
          {images.length > 0 &&
            images.map((data, index) => {
              return <ImageView key={index} data={data}></ImageView>;
            })}
        </ImageBox>
        <button onClick={onSubmit}>등록하기</button>
      </div>
      <div id="load" style={{ display: 'none', width: '100%', position: 'absolute', top: '50%', textAlign: 'center' }}>
        loading...
      </div>
    </>
  );
};

export default UploadGallery;
