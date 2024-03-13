import styled, { css } from 'styled-components';
import { useState, useEffect } from 'react';
import { getLocalJson } from '@/pages/api/api';

// const MenuBox = styled.div(
//   css`
//     display: flex;
//     flex-direction: column;

//     ul,
//     li {
//       list-style: none;
//       padding: 0;
//       margin: 0;
//     }

//     ul > li {
//       padding: 10px;
//       background: #ccc;
//     }

//     ul > li > ul {
//       margin-top: 10px;
//     }

//     ul > li > ul > li {
//       margin: 0 -10px -10px -10px;
//       padding-left: 20px;
//       background: white;
//     }
//   `
// );

const MenuBox = styled.div(
  css`
    width: 100vw;
    height: 50px;
    background: white;
    color: black;
    line-height: 50px;
    margin: 0 auto;
    text-align: center;

    display: flex;
    flex-direction: row;

    z-index: 100;

    border-top: 1px dashed gray;
    border-bottom: 1px solid gray;

    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    ul {
      flex-basis: 0px;
      flex-grow: 1;
    }

    li > a {
      text-decoration: none;
      color: #333;
    }

    ul > li > ul {
      width: 100%;
      display: none;
    }

    ul > li:hover > ul {
      display: block;
      background: white;
    }

    ul > li > ul > li:has(+ li) {
      border-bottom: solid #00000022 1px;
    }
  `
);

const MenuParent = ({ text, sub }) => {
  return (
    <ul>
      <li style={{ fontSize: '15px' }}>
        {text}
        <MenuChild key={`${text}`} items={sub}></MenuChild>
      </li>
    </ul>
  );
};

const MenuChild = ({ items }) => {
  return (
    <ul>
      {Object.values(items).map((item, index) => {
        return (
          <li key={`${index}`} style={{ fontSize: '13px' }}>
            <a href={item['content']}>{item['name']}</a>
          </li>
        );
      })}
    </ul>
  );
};
const MenuContainer = () => {
  const [menuList, setMenuList] = useState({});

  useEffect(() => {
    const getMenu = async () => {
      const menu = await getLocalJson('./localJson.json', 'menuList');
      setMenuList(menu);
    };
    getMenu();
  }, []);

  return (
    <MenuBox>
      {Object.keys(menuList).length > 0 &&
        Object.keys(menuList).map((key) => {
          return <MenuParent key={key} text={key} sub={menuList[key]}></MenuParent>;
        })}
    </MenuBox>
  );
};

export default MenuContainer;
