import moment from 'moment'
import catSvg from '@/__mocks__/cat.svg'

export const uuid = length => {
  let result = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charsLength = chars.length

  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }
  return result
}

export const flatten = (children, extractChildren, originOfMove = null) => {
  if (originOfMove)
    children = children.filter(node => node.id !== originOfMove.id)

  return Array.prototype.concat.apply(
    children,
    children?.map(x =>
      flatten(extractChildren(x) || [], extractChildren, originOfMove)
    )
  )
}

export const extractChildren = x =>
  x?._children?.length ? x._children : x.children

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
        id: uuid(40),
        name: 'Wendell e Daniele',
        image: catSvg,
        inactive: true,
        updatedAt: moment().format(),
        childrenCount: 1,
        children: [
          {
            id: uuid(40),
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
        id: uuid(40),
        name: 'Michelly e Peterson',
        image: catSvg,
        inactive: false,
        updatedAt: moment().format(),
        childrenCount: 2,
        children: [
          {
            id: uuid(40),
            name: 'Nicolly',
            image: catSvg,
            inactive: true,
            updatedAt: moment().format(),
            childrenCount: 0,
            children: [],
          },
          {
            id: uuid(40),
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
        id: uuid(40),
        name: 'Ulisses e Monique',
        image: catSvg,
        inactive: false,
        updatedAt: moment().format(),
        childrenCount: 2,
        children: [
          {
            id: uuid(40),
            name: 'Ian',
            image: catSvg,
            inactive: true,
            updatedAt: moment().format(),
            childrenCount: 0,
            children: [],
          },
          {
            id: uuid(40),
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
        id: uuid(40),
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
