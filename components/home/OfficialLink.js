import { getLocalJson } from '@/pages/api/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import PortfolioContext from '@/context/context';

const LinkParent = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  padding: 10px 70px;
  background-color: white;
`;

const LinkItem = ({ baseUrl, text, item }) => {
  return (
    <Link href={item[1]} passHref>
      <Image style={{ cursor: 'pointer' }} alt={text} src={baseUrl + item[0]} width="30" height="30"></Image>
    </Link>
  );
};

const OfficialLink = () => {
  const [list, setList] = useState({});
  const { prefix } = useContext(PortfolioContext);

  const iconUrl = `${prefix}/images/icons/`;

  useEffect(() => {
    const getList = async () => {
      const items = await getLocalJson('./localJson.json', 'iconList');
      setList(items);
    };
    getList();
  }, []);

  return (
    <LinkParent>
      {Object.keys(list).map((key, index) => {
        return <LinkItem key={index} text={key} item={list[key]} baseUrl={iconUrl}></LinkItem>;
      })}
    </LinkParent>
  );
};

export default OfficialLink;
