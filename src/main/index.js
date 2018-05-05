import './index.html'

const create = (tagName, attrs, childs) => {
  const node = document.createElement(tagName)
  
  if (attrs) {
    Object.entries(attrs).forEach(([attr, value]) => {
      node.setAttribute(attr, value)
    })
  }

  if (Array.isArray(childs) && childs.every(child => child instanceof HTMLElement)) {
    childs.forEach(child => {
      node.appendChild(child)
    })
  }
  else if (childs instanceof HTMLElement) {
    node.appendChild(childs)
  }
  else if (childs) {
    node.textContent = childs
  }

  return node
}


const dirs = process.env.dirs


const projectList = create('ul', null, dirs.map(dir => (
  create('li', null,
    create('a', { href: `/${dir}/index.html`}, dir)
  )
)))


const root = document.getElementById('root')
root.appendChild(projectList)
