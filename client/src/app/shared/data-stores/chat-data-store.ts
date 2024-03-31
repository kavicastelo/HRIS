import {ChatModel} from "../data-models/Chat.model";

export var chatDataStore: ChatModel[] = [
  {
    id: 13,
    messages: [{
      id: 1,
      userId: 1,
      chatId: 13,
      content: 'Hello from john',
      status: 'sent',
      timestamp: '2021-01-01'
    }, {
      id: 2,
      userId: 3,
      chatId: 13,
      content: 'Hello from julia',
      status: 'sent',
      timestamp: '2021-01-01'
    }, {
      id: 3,
      userId: 1,
      chatId: 13,
      content: 'Hello again from john',
      status: 'sent',
      timestamp: '2021-01-01'
    }]
  },
  {
    id: 23,
    messages: [{
      id: 1,
      userId: 2,
      chatId: 23,
      content: 'Hello from mary',
      status: 'sent',
      timestamp: '2021-01-01'
    }]
  },
  {
    id: 43,
    messages: [{
      id: 1,
      userId: 3,
      chatId: 43,
      content: 'Hello from julia',
      status: 'sent',
      timestamp: '2021-01-01'
    }, {
      id: 2,
      userId: 4,
      chatId: 43,
      content: 'Hello again from silvia',
      status: 'sent',
      timestamp: '2021-01-01'
    }]
  }
]
