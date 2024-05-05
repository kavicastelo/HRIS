import {MessageModel} from "../data-models/Message.model";

export var messageDataStore: MessageModel[] = [
  {
    id: 1,
    userId: 1,
    chatId: 13,
    content: 'Hello',
    status: 'sent',
    timestamp: '2021-01-01'
  },
  {
    id: 2,
    userId: 2,
    chatId: 13,
    content: 'Hello',
    status: 'sent',
    timestamp: '2021-01-01'
  },
  {
    id: 3,
    userId: 1,
    chatId: 13,
    content: 'Hello',
    status: 'sent',
    timestamp: '2021-01-01'
  },
  {
    id: 4,
    userId: 2,
    chatId: 13,
    content: 'Hello',
    status: 'sent',
    timestamp: '2021-01-01'
  },
  {
    id: 1,
    userId: 1,
    chatId: 23,
    content: 'Hello from mary',
    status: 'sent',
    timestamp: '2021-01-01'
  },
  {
    id: 2,
    userId: 3,
    chatId: 23,
    content: 'Hello from julia',
    status: 'sent',
    timestamp: '2021-01-01'
  },
  {
    id: 3,
    userId: 1,
    chatId: 23,
    content: 'Hello again from mary',
    status: 'sent',
    timestamp: '2021-01-01'
  },
  {
    id: 4,
    userId: 3,
    chatId: 23,
    content: 'Hello again from julia',
    status: 'sent',
    timestamp: '2021-01-01'
  }
]
