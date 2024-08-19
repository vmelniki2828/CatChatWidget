import styled from 'styled-components';
import { IoChatboxEllipsesOutline } from "react-icons/io5";


export const WidgetIconButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 350px;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  
 
`;

export const WidgetIc = styled(IoChatboxEllipsesOutline)`
  width: 50px;
  height: 50px;
  color:  #000 ;
  &:hover {
    color:  red ;
  }
`;