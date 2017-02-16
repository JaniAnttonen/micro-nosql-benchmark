const app = {}

// API for the microservices running the database tests
const api = axios.create({
  baseURL: 'http://localhost:3000'
})

let FRONT_ITERATIONS = 1000
let BACK_ITERATIONS = 1

const calcSum = (array) => {
  let sum = 0
  for (i = 0; i < array.length; i++) {
    sum += array[i]
  }
  return sum
}

const calcMean = (array) => (
  calcSum(array) / array.length
)

app.tests = function(data) {
  this.description = m.prop(data.description)
  this.done = m.prop(false)
}

app.List = Array

app.vm = (function() {
  const vm = {}

  vm.init = () => {

    vm.writeList = new app.List()
    vm.readList = new app.List()

    vm.redisWrite = new app.List()
    vm.mongoWrite = new app.List()
    vm.redisRead = new app.List()
    vm.mongoRead = new app.List()

    vm.runWriteTests = (iters) => {
      for (i = 0; i < iters; i++) {
        api.get('/rediswrite', {
          params: {
            iter: BACK_ITERATIONS
          }
        }).then(response => {
          vm.redisWrite.push(response.data)
          vm.writeList[0] = calcMean(vm.redisWrite).toFixed(3)
          vm.writeList[2] = calcSum(vm.redisWrite).toFixed(3)
          m.redraw(true)
        })
        api.get('/mongowrite', {
          params: {
            iter: BACK_ITERATIONS
          }
        }).then(response => {
          vm.mongoWrite.push(response.data)
          vm.writeList[1] = calcMean(vm.mongoWrite).toFixed(3)
          vm.writeList[3] = calcSum(vm.mongoWrite).toFixed(3)
          m.redraw(true)
        })
      }
    }

    vm.runReadTests = (iters) => {
      for (i = 0; i < iters; i++) {
        api.get('/redisread', {
          params: {
            iter: BACK_ITERATIONS
          }
        }).then(response => {
          vm.redisRead.push(response.data)
          vm.readList[0] = calcMean(vm.redisRead).toFixed(3)
          vm.readList[2] = calcSum(vm.redisRead).toFixed(3)
          m.redraw(true)
        })
        api.get('/mongoread', {
          params: {
            iter: BACK_ITERATIONS
          }
        }).then(response => {
          vm.mongoRead.push(response.data)
          vm.readList[1] = calcMean(vm.mongoRead).toFixed(3)
          vm.readList[3] = calcSum(vm.mongoRead).toFixed(3)
          m.redraw(true)
        })
      }
    }

    // Increase iterations
    vm.increaseIters = (type) => {
      if (type == "front") FRONT_ITERATIONS = FRONT_ITERATIONS * 10
      if (type == "back") BACK_ITERATIONS = BACK_ITERATIONS * 10
    }
    // Decrease iterations
    vm.decreaseIters = (type) => {
      if (type == "front") FRONT_ITERATIONS = FRONT_ITERATIONS == 1 ? 1 : FRONT_ITERATIONS / 10
      if (type == "back") BACK_ITERATIONS = BACK_ITERATIONS == 1 ? 1 : BACK_ITERATIONS / 10
    }

  }

  return vm
}())

app.controller = function() {
  app.vm.init()
}

// View
app.view = function() {
  return [
    m("p", `${FRONT_ITERATIONS} * ${BACK_ITERATIONS} tests with dummy session data.`),

    m("button", {
      onclick: () => app.vm.increaseIters("front")
    }, "iterations * 10"),

    m("button", {
      onclick: () => app.vm.decreaseIters("front")
    }, "iterations / 10"),

    m("button", {
      onclick: () => app.vm.runWriteTests(FRONT_ITERATIONS)
    }, "Run write tests!"),

    m("button", {
      onclick: () => app.vm.runReadTests(FRONT_ITERATIONS)
    }, "Run read tests!"),

    m("div", [
      m("span", `Write tests:`),

      m("table", [
        m("tr", [
          m("td", "Redis mean"),
          m("td", "Mongo mean"),
          m("td", "Redis total"),
          m("td", "Mongo total")
        ]),

        m("tr", [
          app.vm.writeList.map((test, index) => {
            return m("td", `${test} ms`)
          })
        ])
      ]),

      m("span", `Read tests:`),

      m("table", [
        m("tr", [
          m("td", "Redis mean"),
          m("td", "Mongo mean"),
          m("td", "Redis total"),
          m("td", "Mongo total")
        ]),

        m("tr", [
          app.vm.readList.map((test, index) => {
            return m("td", `${test} ms`)
          })
        ])
      ]),

      m("span", `${app.vm.mongoWrite.length} write tests ran`),
      m("br"),
      m("span", `${app.vm.mongoRead.length} read tests ran`)
    ])
  ]
}

//initialize the application
m.mount(document.body, {
  controller: app.controller,
  view: app.view
})