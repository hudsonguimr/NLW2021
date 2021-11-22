import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView} from 'react-native';

import {styles} from './styles';
import {Message, MessageProps} from '../Message'
import { api } from '../../services/api';
import {io} from 'socket.io-client';
import {MESSAGES_EXAMPLE} from '../../utils/messages';


const socket = io(String(api.defaults.baseURL));

let messageQueue: MessageProps[]=[];
socket.on('new_message', (newMessage)=>{
    messageQueue.push(newMessage)
    console.log(newMessage);

})

export function MessageList(){

  const [] = useState();
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);
  
  useEffect(()=>{
      async function  fetchMessages(){
          const messagesResponse = await api.get<MessageProps[]>('/messages/last3');
          setCurrentMessages(messagesResponse.data);
          
      }

      fetchMessages();
  },[])


    useEffect(()=>{
        const Timer = setInterval(()=>{
            if(messageQueue.length>0){
                setCurrentMessages(prevState =>[messageQueue[0],prevState[0], prevState[1]]);
                messageQueue.shift();
            }
        },3000);
        return() => clearInterval(Timer);
    })
    return(
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="never"

            >
                {currentMessages.map((message) => <Message key ={message.id} data={message}/>)}

        </ScrollView>
    )
}