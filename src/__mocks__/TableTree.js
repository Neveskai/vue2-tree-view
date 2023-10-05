import moment from 'moment'
import catSvg from '@/__mocks__/cat.svg'

const uuid = length => {
  let result = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charsLength = chars.length

  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }
  return result
}

export const searchOptions = {
  searchable: true,
  path: ['name'],
  placeholder: '',
}

export const tree = [
  {
    id: null,
    root: true,
    name: 'Teodomiro e Solange',
    image: catSvg,
    inactive: false,
    updatedAt: moment().format(),
    childrenCount: 4,
    children: [
      {
        id: uuid(20),
        name: 'Wendell e Daniele',
        image: catSvg,
        inactive: true,
        updatedAt: moment().format(),
        childrenCount: 1,
        children: [
          {
            id: uuid(20),
            name: 'Henri',
            image: catSvg,
            inactive: true,
            updatedAt: moment().format(),
            childrenCount: 0,
            children: [],
          },
        ],
      },
      {
        id: uuid(20),
        name: 'Michelly e Peterson',
        image: catSvg,
        inactive: false,
        updatedAt: moment().format(),
        childrenCount: 2,
        children: [
          {
            id: uuid(20),
            name: 'Nicolly',
            image: catSvg,
            inactive: true,
            updatedAt: moment().format(),
            childrenCount: 0,
            children: [],
          },
          {
            id: uuid(20),
            name: 'Nicolas',
            image: catSvg,
            inactive: true,
            updatedAt: moment().format(),
            childrenCount: 0,
            children: [],
          },
        ],
      },
      {
        id: uuid(20),
        name: 'Ulisses e Monique',
        image: catSvg,
        inactive: false,
        updatedAt: moment().format(),
        childrenCount: 2,
        children: [
          {
            id: uuid(20),
            name: 'Ian',
            image: catSvg,
            inactive: true,
            updatedAt: moment().format(),
            childrenCount: 0,
            children: [],
          },
          {
            id: uuid(20),
            name: 'Estevão',
            image: catSvg,
            inactive: true,
            updatedAt: moment().format(),
            childrenCount: 0,
            children: [],
          },
        ],
      },
      {
        id: uuid(20),
        name: 'Wallace',
        image: catSvg,
        inactive: true,
        updatedAt: moment().format(),
        childrenCount: 0,
        children: [],
      },
    ],
  },
]

export const props = {
  searchOptions: searchOptions,
  loading: false,
  tree: tree,
}
