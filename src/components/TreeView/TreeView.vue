<template>
  <section>
    <div class="tree-view-section">
      <div class="tree-view">
        <slot name="search"></slot>

        <div class="content-header-actions">
          <slot name="zoom" :zoomScale="zoomScale"></slot>
        </div>
      </div>

      <Transition>
        <TreeLoading v-if="loading" />
      </Transition>

      <Transition>
        <div v-if="tree" class="relative" :style="_hide">
          <div class="drag-overlay" :style="_overlayStyle" />
          <sVueTree
            id="vuetree"
            ref="tree"
            v-intersect="onIntersect"
            :collapseEnabled="collapseEnabled"
            :config="config"
            :dataset="tree"
            :direction="'vertical'"
            :linkStyle="'straight'"
            class="content-tree"
          >
            <template v-slot:node="{ node, collapsed }">
              <slot
                name="nodes"
                :node="node"
                :configPos="configPos"
                :collapsed="collapsed"
                :pushChild="pushChild"
                :insertCopy="insertCopy"
                :moveNode="moveNode"
                :removeNode="removeNode"
                :overrideChildren="overrideChildren"
                :toggleChildren="handleToggleChildren"
              >
              </slot>
            </template>
          </sVueTree>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script>
import vue from 'vue'
import VueTree from '@ssthouse/vue-tree-chart'
import TreeLoading from '@/components/TreeLoading/TreeLoading.vue'
import { v4 as uuid } from 'uuid'

VueTree.computed = null

const sVueTree = vue.component('VueTree', {
  extends: VueTree,
  computed: {
    initialTransformStyle() {
      return {
        transform: `scale(1) translate(${this.initTransformX}px, ${this.initTransformY}px)`,
        transformOrigin: 'center',
      }
    },
  },
  methods: {
    resetTree() {
      this._dataset = this.updatedInternalData(this.dataset)
      if (this._dataset) this.draw()
    },
    deepCopy(node, start = true, parent = null) {
      const hasChildren = node?.children?.length || node?._children?.length

      if (start) {
        if (hasChildren) {
          if (node.children.length) {
            node._children = node.children
            node.children = []
          }
        } else {
          node._children = []
        }

        node._parent = parent
        node._collapsed = true
        node._key = uuid()
      }

      if (hasChildren) {
        if (node.children.length)
          node.children.map(x => this.deepCopy(x, start, node))
        if (node._children.length)
          node._children.map(x => this.deepCopy(x, start, node))
      }

      return node
    },
    init() {
      this._dataset = this.updatedInternalData(this.dataset)

      if (this._dataset) this.draw()
      this.enableDrag()
      this.initTransform()
    },
  },
})

export default {
  name: 'TreeView',
  components: {
    TreeLoading,
    sVueTree,
  },
  props: {
    config: {
      type: Object,
    },
    tree: {
      required: true,
    },
    hooks: {
      type: Object,
      default: () => {
        return {
          beforeCloseNode: null,
          afterCloseNode: null,
          beforeNodeOpen: null,
          afterNodeOpen: null,
        }
      },
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      key: uuid(),
      zoomScale: '100%',
      scale: 1,
      collapseEnabled: false,
      keys: {
        space: false,
        shift: false,
      },
      mouse: {
        click: false,
        holding: false,
        dragging: false,
      },
      initX: 0,
      initY: 0,
      startX: 0,
      startY: 0,
      mouseDownTransform: '',
      rows: [],
    }
  },
  watch: {
    ['zoomScale']: function (n, o) {
      this.setZoomScale(n, o)
    },
    ['scale']: function (n, o) {
      this.setScale(n, o)
    },
  },
  computed: {
    _hide() {
      return !this.loading ? null : { display: 'none' }
    },
    _draw() {
      return this.$refs.tree.draw
    },
    overlay() {
      return (
        !!this.tree && (!this.tree.children || this.tree.children.length < 1)
      )
    },
    _showOverlay() {
      return this.mouse['holding'] || this.keys['space']
    },
    _overlayStyle() {
      const style = {
        zIndex: '-1000',
        cursor: null,
      }

      if (this._showOverlay) {
        style.zIndex = '1000'
        style.cursor = 'grab'
      }

      if (this.mouse['holding'] || this.mouse['dragging'])
        style.cursor = 'grabbing'

      return style
    },
  },
  mounted() {
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    resetTree() {
      this.$refs.tree?.resetTree()
    },
    pushChild(child, node) {
      if (node?._children.length) this.toggleChildren(node, true)

      const children = node.children
      const newNode = this.$refs.tree.deepCopy(child, true, node)
      children.push(newNode)

      this._draw()
      setTimeout(() => {
        this._draw()
        this.centerNodeOnScreen(child)
      }, 400)
    },
    getChildrenRef(node) {
      const hasChildren = node?.children?.length || node?._children?.length

      let children = []

      if (hasChildren) {
        if (node?.children.length) {
          children = node.children
        } else {
          children = node._children
        }
      } else {
        node._children = []
        node.children = []
        children = node._children
      }

      return children
    },
    insertCopy(copy, target, newQuickNode = false) {
      const children = this.getChildrenRef(target)

      copy = this.realDeepCopy(copy)
      copy = this.$refs.tree.deepCopy(copy, true, target)
      children.push(copy)

      this._draw()
      setTimeout(() => {
        this._draw()
        if (newQuickNode) {
          if (target.id !== null && !target?.children.length)
            this.toggleChildren(target, false)
          this.centerNodeOnScreen(copy)
        }
      }, 400)

      return copy
    },
    async handleToggleChildren(node, collapsed) {
      const { beforeNodeOpen, afterNodeOpen, beforeCloseNode, afterCloseNode } =
        this.hooks

      const before = collapsed ? beforeNodeOpen : beforeCloseNode
      const after = collapsed ? afterNodeOpen : afterCloseNode

      if (before) await before(node)

      this.toggleChildren(node, true)

      if (after) await after(node)
    },
    toggleChildren(node, moveCam = true) {
      if (node.children === undefined) node.children = []

      if (node.children.length) {
        node._children = node.children
        node.children = []
        node._collapsed = true
      } else {
        node.children = node._children
        node._children = []
        node._collapsed = false
      }

      this._draw()
      setTimeout(() => {
        this._draw()
        if (moveCam) this.centerNodeOnScreen(node)
      }, 400)
    },
    removeNode(node) {
      const children = this.getChildrenRef(node._parent)
      const childIndex = this.findChildIndex(node)
      children.splice(childIndex, 1)

      this._draw()
    },
    moveNode(node, targetNode, moveCam = true) {
      this.removeNode(node)

      const children = this.getChildrenRef(targetNode)

      node._parent = targetNode
      children.push(node)

      this._draw()
      setTimeout(() => {
        this._draw()
        if (moveCam) this.centerNodeOnScreen(node)
      }, 400)
    },
    editNode(editedNode, targetNode) {
      const blocked = ['children', '_children', '_key', '_parent']

      for (var key in editedNode) {
        if (!blocked.includes(key)) targetNode[key] = editedNode[key]
      }
    },
    overrideChildren(node, targetNode = this.tree[0]) {
      node = this.realDeepCopy(node)
      node = this.$refs.tree.deepCopy(node, true, targetNode)

      targetNode._children = [node]
      targetNode.children = []
      this.toggleChildren(targetNode)

      this._draw()
      setTimeout(() => {
        this._draw()
        this.centerNodeOnScreen(node)
      }, 400)
    },
    overrideNode(hierarchy, targetNode) {
      hierarchy = this.$refs.tree.deepCopy(hierarchy, true, targetNode._parent)

      const target = targetNode._parent
      const childIndex = this.findChildIndex(targetNode)

      target.children[childIndex] = hierarchy

      let children = hierarchy
      do {
        this.toggleChildren(children)

        if (!children.children.length) {
          children._collapsed = true
          break
        }
        children = children?.children[0]
      } while (children)

      this._draw()
      setTimeout(() => {
        this._draw()
        this.centerNodeOnScreen(hierarchy)
      }, 400)

      return children
    },
    getPos() {
      const tree = this.$refs.tree
      const svg = tree.$refs.svg

      const transform = svg.style.transform
      const translate = transform
        .substring(transform.indexOf('translate'))
        .replace('translate', '')

      const [translateX, translateY] = translate
        .replace(/[^0-9,.-]/g, '')
        .split(',')

      return { x: translateX, y: translateY }
    },
    setPos(x = this.initX, y = this.initY) {
      const tree = this.$refs.tree
      const svg = tree.$refs.svg
      const dom = tree.$refs.domContainer
      const scale = tree.currentScale

      x = Math.floor(x)
      y = Math.floor(y)

      svg.style.transition = '0.6s transform'
      dom.style.transition = '0.6s transform'

      svg.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`
      dom.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`

      setTimeout(() => {
        svg.style.transition = 'none'
        dom.style.transition = 'none'
      }, 601)
    },
    centerNodeOnScreen(node) {
      const nodeDataList = this.$refs.tree.nodeDataList
      const nodePosition = nodeDataList.find(
        d3node => d3node.data._key === node._key
      )

      const px = -nodePosition?.x + window.innerWidth / 2
      const py =
        nodePosition?.y - window.innerHeight / 2 + this.config.nodeHeight

      this.setPos(px, -py)
    },
    realDeepCopy(node) {
      let obj = { _key: uuid() }
      for (var key in node) {
        if (node[key] === null) {
          obj[key] = null
        } else if (key === 'children' || key === '_children') {
          obj[key] = []
        } else if (Array.isArray(node[key])) {
          obj[key] = node[key]
        } else if (typeof node[key] === 'object') {
          obj[key] = this.realDeepCopy(node[key])
        } else {
          obj[key] = node[key]
        }
      }
      return obj
    },
    findChildIndex(node) {
      const children = node._parent.children
        ? node._parent.children
        : node.parent.children

      const childIndex = children.findIndex(brother => {
        return brother._key === node._key
      })

      return childIndex
    },
    findNodeBy(key, val, timeout = 1500) {
      if (val === null) return this.tree[0]

      return new Promise((resolve, reject) => {
        this.searchBy(key, val, this.tree, resolve)
        setTimeout(() => reject(false), timeout)
      })
    },
    searchBy(key, val, nodes, resolve) {
      nodes.some(node => {
        if (node[key] === val) {
          resolve(node)
          return true
        }

        if (node?.children?.length) {
          return this.searchBy(key, val, node.children, resolve)
        }
        if (node?._children?.length) {
          return this.searchBy(key, val, node._children, resolve)
        }
      })
    },
    treeToRowsIds(node, rows) {
      rows.push(node.id)

      if (node?.children?.length) {
        this.recursiveTreeToRowIDs(node.children, rows)
      }
      if (node?._children?.length) {
        this.recursiveTreeToRowIDs(node._children, rows)
      }
    },
    recursiveTreeToRowIDs(nodes, rows) {
      nodes.forEach(node => {
        this.treeToRowsIds(node, rows)
      })
    },
    treeToRows(node, rows) {
      rows.push(node)

      if (node?.children?.length) {
        this.recursiveTreeToRows(node.children, rows)
      }
      if (node?._children?.length) {
        this.recursiveTreeToRows(node._children, rows)
      }
    },
    recursiveTreeToRows(nodes, rows) {
      nodes.forEach(node => {
        this.treeToRows(node, rows)
      })
    },
    handleKeyDown(event) {
      const isBody = event.target.localName == 'body'

      // Space
      if (event.key == ' ' && isBody) {
        event.preventDefault()
        if (!this.keys['space']) this.keys['space'] = true
      }

      // Shift
      if (event.key == 'Shift') {
        event.preventDefault()
        if (!this.keys['shift']) this.keys['shift'] = true
      }
    },
    handleKeyUp(event) {
      // Space
      if (event.key == ' ') {
        event.preventDefault()
        this.keys['space'] = false
      }

      // Shift
      if (event.key == 'Shift') {
        event.preventDefault()
        this.keys['shift'] = false
      }
    },
    onIntersect(entries) {
      this.loaded = true
      if (entries[0].isIntersecting) {
        this.configWheel()
        this.configDrag()
        this.configDragOverlay()
        this.configPos()
      }
    },
    configWheel() {
      document
        .querySelector('#vuetree')
        .addEventListener('wheel', this.handleWheel, {
          passive: false,
        })
    },
    configDrag() {
      const container = this.$refs.tree?.$refs.container
      container.onmousedown = null
      container.onmousemove = null
      container.onmouseout = null
      container.onmouseup = null
    },
    configDragOverlay() {
      const MATCH_TRANSLATE_REGEX = /translate\((-?\d+)px, ?(-?\d+)px\)/i
      const svgElement = this.$refs.tree?.$refs.svg
      const element = document.querySelector('.drag-overlay')
      if (!element) return

      const onmousedown = this.handleMouseDown
      const onmousemove = event => {
        if (!this.mouse['dragging']) return
        const originTransform = this.mouseDownTransform
        let originOffsetX = 0
        let originOffsetY = 0
        if (originTransform) {
          const result = originTransform.match(MATCH_TRANSLATE_REGEX)
          if (result !== null && result.length !== 0) {
            const [offsetX, offsetY] = result.slice(1)
            originOffsetX = parseInt(offsetX)
            originOffsetY = parseInt(offsetY)
          }
        }
        let newX =
          Math.floor(
            (event.clientX - this.startX) / this.$refs.tree?.currentScale
          ) + originOffsetX
        let newY =
          Math.floor(
            (event.clientY - this.startY) / this.$refs.tree?.currentScale
          ) + originOffsetY
        let transformStr = `translate(${newX}px, ${newY}px)`
        if (originTransform) {
          transformStr = originTransform.replace(
            MATCH_TRANSLATE_REGEX,
            transformStr
          )
        }
        svgElement.style.transform = transformStr
        this.$refs.tree.$refs.domContainer.style.transform = transformStr
      }

      const stopDrag = () => {
        this.startX = 0
        this.startY = 0
        this.mouse['click'] = false
        this.mouse['holding'] = false
        this.mouse['dragging'] = false
      }

      const onmouseout = stopDrag
      const onmouseup = stopDrag

      element.addEventListener('mousedown', onmousedown)
      element.addEventListener('mousemove', onmousemove)
      element.addEventListener('mouseup', onmouseup)
      element.addEventListener('mouseout', onmouseout)
    },
    configPos(collapsed) {
      const nodeHeight = this.config.height

      const { x } = this.getPos()
      this.initX = x
      this.initY = collapsed ? -nodeHeight : parseInt(-nodeHeight / 2, 10)
      this.restoreScale()
    },
    restoreScale() {
      this.zoomScale = '100%'
      this.centerNodeOnScreen(this.tree[0])
    },
    centralize() {
      const { y } = this.getPos()
      this.setPos(this.initX, y)
    },
    getCollapsed(node, collapsed) {
      if ([null, undefined].includes(collapsed))
        return !!node.children && !!node.children.length ? false : null

      if (collapsed == false && (!node.children || !node.children.length))
        return null

      return collapsed
    },
    changeZoomScale(event) {
      this.zoomScale = event.target.value
    },
    zoomIn() {
      const value = this.getZoomScaleValue()
      this.zoomScale = `${value + 10}%`
    },
    zoomOut() {
      const value = this.getZoomScaleValue()
      this.zoomScale = `${value - 10}%`
    },
    getZoomScaleValue() {
      const zoomScale = (this.zoomScale && this.zoomScale.toString()) || '100%'
      return Number(zoomScale.replace(/[^0-9]/g, ''))
    },
    handleZoomScale(event, _self = this) {
      event.preventDefault()

      // Zoom In|Out (ctrl + scroll)
      if (event.ctrlKey) {
        return event.deltaY < 0 ? _self.zoomIn() : _self.zoomOut()
      }

      const { x, y } = _self.getPos()
      const pos = { x, y }

      // Horizontal
      if (this.keys['shift']) pos.x = x - event.deltaY
      // Vertical
      else pos.y = y - event.deltaY

      _self.setPos(pos.x, pos.y)
    },
    handleMouseDown(event) {
      const svgElement = this.$refs.tree?.$refs.svg

      const left = event.button === 0
      const middle = event.button === 1
      const right = event.button === 2
      if (middle) event.preventDefault()

      if (left) {
        const { _prevClass } = event.target
        if (!_prevClass) return
        const isTreeCanvas = _prevClass.includes('vue-tree')
        const isTreeContainer = _prevClass.includes('tree-container')
        const isTreeCanvasOverlay = _prevClass.includes('drag-overlay')
        const isNodeSlot = _prevClass.includes('node-slot')
        const isExpandSlot = _prevClass.includes('expand')
        if (
          !isTreeCanvas &&
          !isTreeContainer &&
          !isTreeCanvasOverlay &&
          !isNodeSlot &&
          !isExpandSlot
        )
          return
      }

      const isDraggable = this.keys['space'] || middle || left
      if (!isDraggable || right) return

      this.mouse['click'] = true

      setTimeout(() => {
        if (this.mouse['click'] && !this.mouse['holding'])
          this.mouse['holding'] = true
      }, 150)

      this.mouseDownTransform = svgElement?.style.transform
      this.startX = event.clientX
      this.startY = event.clientY
    },
    handleMouseUp() {
      this.mouse['click'] = false
      this.mouse['holding'] = false
      this.mouse['dragging'] = false
    },
    handleMouseMove() {
      if (!this.mouse['click']) return
      if (!this.mouse['dragging']) this.mouse['dragging'] = true
      if (!this.mouse['holding']) this.mouse['holding'] = true
    },
    setZoomScale(n, o) {
      const valueNew = String(n).replace(/[^\-0-9]/g, '')
      const valueOld = String(o).replace(/[^0-9]/g, '')

      if (valueNew == valueOld) return
      if (valueNew < 0) return (this.zoomScale = '0%')

      this.scale = valueNew / 100
    },
    setScale(n, o) {
      if (n == o) return
      this.$refs.tree?.setScale(this.scale)
    },
    handleEmit(event, payload) {
      this.$emit(event, payload)
    },
    handleWheel(e) {
      const path = (e.path || e.composedPath() || [])
        .map(({ _prevClass }) => _prevClass)
        .filter(el => !!el)

      // Verificar se deve ignorar o wheel da tree, para poder dar scrollar lugares que possuem scroll além do scroll geral da página.
      // exemplo: Quando estiver dando wheel no tree-root que contem a descrição, deve ser ignorado o da página.
      const classList = [
        'tree-root--rich-editor',
        'text-quick-edit--content-edit',
      ]
      if (path.some(_class => classList.some(_c => _class.includes(_c)))) return

      this.handleZoomScale(e, this)
    },
  },
  provide() {
    return {
      //methods
      changeZoomScale: this.changeZoomScale,
      restoreScale: this.restoreScale,
      handleEmit: this.handleEmit,
      centralize: this.centralize,
      configPos: this.configPos,
      moveNode: this.moveNode,
      setScale: this.setScale,
      zoomOut: this.zoomOut,
      zoomIn: this.zoomIn,
      setPos: this.setPos,
      getPos: this.getPos,
      colors: this.colors,
      help: this.help,
      addChild: this.addChild,
      addChildren: this.addChildren,
      toggleChildren: this.handleToggleChildren,
      insertCopy: this.insertCopy,
      //data
      mouseDownTransform: this.mouseDownTransform,
      collapseEnabled: this.collapseEnabled,
      zoomScale: this.zoomScale,
      startX: this.startX,
      startY: this.startY,
      loaded: this.loaded,
      scale: this.scale,
      initX: this.initX,
      initY: this.initY,
      mouse: this.mouse,
      keys: this.keys,
    }
  },
}
</script>

<style lang="scss" src="./style.scss" scoped />
