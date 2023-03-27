const dragfn = {
  // 适配移动端和大部分PC，不支持Safari PC
  baseTouch (dragged, place) {
    let diffX = 0
    let diffY = 0

    // 开始触摸，记录初始位置
    dragged.ontouchstart = (event) => {
      let rect = dragged.getBoundingClientRect()
      // 添加特定类名dragging
      event.target.classList.add('dragging')
      place.classList.add('dropzone')
      // 获取触摸点与目标元素之间的差值坐标
      diffX = event.touches[0].clientX - rect.left
      diffY = event.touches[0].clientY - rect.top
    }
    // 移动中，物体移至手指松开位置
    dragged.ontouchmove = (event) => {
      event.preventDefault()
      dragged.textContent = '移动中...'
      // 目标元素跟随触摸点移动
      dragged.style.left = `${event.touches[0].clientX - diffX}px`
      dragged.style.top = `${event.touches[0].clientY - diffY}px`
    }
    // 结束触摸,清除拖拽数据
    dragged.ontouchend = () => {
      dragged.classList.remove('dragging')
      dragged.innerHTML = dragged.dataset.ini
      place.classList.remove('dropzone')
    }
  },
  // 适配大部分PC
  baseDrag (dragged, place) {
    // 开始拖拽
    dragged.ondragstart = (event) => {
      // 重置dataTransfer对象
      event.dataTransfer.clearData()
      // 添加特定类名dragging，并将其存储在dataTransfer对象中
      event.target.classList.add('dragging')
      place.classList.add('dropzone')
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('text/plain', event.target.className)
      // 存储初始位置
      event.dataTransfer.setData('startX/plain', event.clientX)
      event.dataTransfer.setData('startY/plain', event.clientY)
    }
    // 允许放置，可插入.dropzone范围内的任意节点
    place.ondragover = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      dragged.textContent = '移动中...'
    }
    // 将拖拽物移至鼠标松开时的位置
    place.ondrop = (event) => {
      event.preventDefault()
      let source = event.dataTransfer.getData('text/plain')
      if (source.includes('dragging')) {
        let dropped = document.getElementsByClassName('dragging')[0]
        let last = dropped.getBoundingClientRect()
        let startX = event.dataTransfer.getData('startX/plain')
        let startY = event.dataTransfer.getData('startY/plain')
        dropped.style.left = `${last.left + event.clientX - startX}px`
        dropped.style.top = `${last.top + event.clientY - startY}px`
        place.appendChild(dropped)
      }
    }
    // 边界提示
    place.ondragleave = (event) => {
      dragged.textContent = 'No'
      event.preventDefault()
    }
    // 清除拖拽数据
    dragged.ondragend = () => {
      dragged.classList.remove('dragging')
      dragged.innerHTML = dragged.dataset.ini
      place.classList.remove('dropzone')
    }
  }
}
export default dragfn
