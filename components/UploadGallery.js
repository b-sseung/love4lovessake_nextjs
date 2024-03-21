import DatePicker from 'react-datepicker';
import styled, { css } from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import $ from 'jquery';
import { useState, forwardRef, useEffect, useReducer } from 'react';
import { getLocalJson, insertGallery, addRow } from '@/pages/api/api';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { byteLength, toByteArray } from 'base64-js';
// react-datepicker,

const uploadFileForm = (state, action) => {
  state = { ...state, [action.type]: action.value };
  return state;
};

const RadioButton = ({ value, name, text, onChange }) => {
  return (
    <>
      <input type="radio" value={value} name={name} id={value} onChange={() => onChange(name, value)}></input>
      <label htmlFor={value}>{text}</label>
    </>
  );
};

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
    const datas = [];

    let fileList = e.target.files;

    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      extensions.push(file['type']);

      const newFile = await imageCompression(fileList[i], {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
      });

      const resizingFile = new File([newFile], file['type'], { type: file['type'] });

      let fileReader = new FileReader();
      fileReader.onload = () => {
        const result = fileReader.result;
        const resultArr = [];
        let index = 0;

        while (index < result.length) {
          let lastIndex = Math.min(index + 50000, result.length);
          resultArr.push(result.slice(index, lastIndex));
          index = lastIndex;
        }

        thumnails.push(result);
        datas.push(resultArr);
        changeState('file_data', [...datas]);
        setImages(thumnails);
      };

      fileReader.readAsDataURL(resizingFile);
    }

    changeState('file_extension', extensions);
  };

  const onSubmit = async () => {
    const fileData = JSON.stringify(initState['file_data']);
    const fileExtension = JSON.stringify(initState['file_extension']);

    const year = initState['date'].getFullYear();

    const getResponse = await fetch('/api/get', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: year, range: 'A:B' }),
    });

    const getResult = await getResponse.json();
    console.log(getResult.data);

    const response = await fetch('/api/insert', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...initState, seq: '', file_data: fileData, file_extension: fileExtension }),
    });

    const content = await response.json();
    console.log(content);
  };

  return (
    <>
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
      {images.length > 0 &&
        images.map((data, index) => {
          return <ImageView key={index} data={data}></ImageView>;
        })}
      <button onClick={onSubmit}>등록하기</button>
    </>
  );
};

export default UploadGallery;
