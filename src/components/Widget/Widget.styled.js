import styled from 'styled-components';
import { RxCross2 } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";
import { IoSendOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";


export const WidgetCon = styled.div`
width: 340px;
height:650px;
background-color: #fff;
border:1px solid #ccc;
position: fixed;
z-index: 999;
bottom: 40px;
right: 400px;
display: flex;
flex-direction: column;
align-items: center;
border-radius: 15px;
`;

export const ChatName = styled.h2`
text-align: center;
font-size: 12px;
margin:0;
`;

export const JoinWrap = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;

export const WidgetInputName = styled.input`
border: 1px solid #ccc;
border-radius: 5px;
width:290px;
height:25px;
margin-bottom:15px;
`;

export const JoinButton = styled.button`
cursor: pointer;
color:#fff;
background-color: #007bff;
border:none;
border-radius: 5px;
width:150px;
height:25px;
`;

export const TextArea = styled.div`
width:340px;
height:530px;
overflow-y: auto;
box-sizing: border-box;
scrollbar-width:thin;
`;

export const WrapArea = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


export const SendBtn = styled.button`
width: 35px;
height: 20px;
right: 25px;
  bottom: 26px;

  border-radius: 5px;
  border: none;
  background-color: #0A1019;
  color: #fff;
  cursor: pointer;
  display:flex;
  align-items: center;
  justify-content: center;
  position:absolute;
`;
 export const IconButton = styled(IoSendOutline)`
 width: 20px;
height: 16px;
padding-left:5px;
color: white;
 `;

 export const ChatText = styled.p`
 font-family: 'Geologica';
font-size: 12px;
font-weight: 300;
line-height: 15px;
text-align: left;
color: #0A1019;
max-width: 200px;
word-wrap: break-word;
    overflow-wrap: break-word;
 `;

 export const ChatDiv = styled.div`
 display:flex;
  flex-direction: column;
  align-items: ${({ isClient }) => (isClient ? 'flex-end' : 'flex-start')};

 `

 export const MessageBox = styled.div`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #B7B0C7;
  background-color: ${({ isClient }) => (isClient ? 'transparent' : '#EFE9FF')};
`;

export const MessageWrap = styled.div`
display:flex;
flex-direction: ${({ isClient }) => (isClient ? 'row-reverse' : 'row')};
`;


export const UserImg = styled.img`
 width: 30px;
height: 30px;
border-radius: 10px;
margin:${({ isClient }) => (isClient ? '0 0 0 10px' : '0 10px 0 0')};
 `;

export const MessageTime = styled.p`
font-family: 'Geologica';
font-size: 8px;
font-weight: 400;
line-height: 10px;
text-align: right;
`;

export const InfoWrap = styled.div`
display: flex;
width: 330px;
height: 150px;
align-items: center;
justify-content: space-between;
border-bottom: 1px solid #B7B0C7;
`;

export const CloseButton = styled(RxCross2)`
width: 20px;
height: 20px;
margin:0;
color: black;
cursor: pointer;
&:hover {
    color: red;
  }
`;

export const CollapseButton = styled(IoRemoveOutline)`
width: 20px;
height: 20px;
margin:0;
padding-right: 10px;
color: black;
cursor: pointer;
&:hover {
    color: gray;
  }

`;

export const ClientInfoWrap = styled.div`
width: 200px;
height: 112px;
border-radius: 10px;
background-color: #FFFFFF;
box-shadow: 0px 0px 12.2px 0px #0000001C;
margin-left: 70px;
`;

export const WidgetInput = styled.input`
width: 300px;
height: 30px;
border-radius: 10px;
border: 1px solid #B7B0C7;
margin-bottom:20px;
`;

export const WidgetSettingsIcon = styled(BsThreeDots)`

`;

export const WidgetUserName = styled.p`
font-family: 'Geologica';
font-style: normal;
font-weight: 400;
font-size: 10px;
line-height: 12px;
color: #B7B0C7;


`;

export const WidgetUserInf = styled.p`
font-family: 'Geologica';
font-style: normal;
font-weight: 300;
font-size: 10px;
line-height: 12px;

color: #0A1019;

`;