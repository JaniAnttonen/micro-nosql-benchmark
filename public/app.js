const app = {}

// API for the microservices running the database tests
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

let FRONT_ITERATIONS = 100
let BACK_ITERATIONS = 10

const calcSum = (array) => {
  let sum = 0
  for(i=0; i<array.length; i++) {
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

app.vm = ( function() {
  const vm = {}

  vm.init = () => {

    vm.list = new app.List()
    vm.redis = new app.List()
    vm.mongo = new app.List()

    //adds a app to the list, and clears the description field for user convenience
    vm.runTests = (iters) => {
      for( i=0; i<iters; i++ ) {
        api.get('/redis', {
          params: {
            iter: BACK_ITERATIONS
          }
        }).then(response =>
          vm.redis.push(response.data)
        )
        api.get('/mongo', {
          params: {
            iter: BACK_ITERATIONS
          }
        }).then(response =>
          vm.mongo.push(response.data)
        )
      }
      vm.list[0] = calcMean(vm.redis).toFixed(3)
      vm.list[1] = calcMean(vm.mongo).toFixed(3)
      vm.list[2] = calcSum(vm.redis).toFixed(3)
      vm.list[3] = calcSum(vm.mongo).toFixed(3)
    }

    // Increase iterations
    vm.increaseIters = (type) => {
      if(type=="front") FRONT_ITERATIONS = FRONT_ITERATIONS * 10
      if(type=="back") BACK_ITERATIONS = BACK_ITERATIONS * 10
    }
    // Decrease iterations
    vm.decreaseIters = (type) => {
      if(type=="front") FRONT_ITERATIONS = FRONT_ITERATIONS == 1 ? 1 : FRONT_ITERATIONS / 10
      if(type=="back") BACK_ITERATIONS = BACK_ITERATIONS == 1 ? 1 : BACK_ITERATIONS / 10
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

    m( "p", `${FRONT_ITERATIONS} * ${BACK_ITERATIONS} tests with dummy session data.`),

    m( "button", {
      onclick: () => app.vm.increaseIters("front")
    }, "+ frontend"),

    m( "button", {
      onclick: () => app.vm.increaseIters("back")
    }, "+ backend"),

    m( "button", {
      onclick: () => app.vm.decreaseIters("front")
    }, "- frontend"),

    m( "button", {
      onclick: () => app.vm.decreaseIters("back")
    }, "- backend"),

    m( "button", {
      onclick: () => app.vm.runTests(FRONT_ITERATIONS)
    }, "Run tests!"),

    m( "table", [
      m( "tr", [
        m( "td", "Redis mean"),
        m( "td", "Mongo mean"),
        m( "td", "Redis total"),
        m( "td", "Mongo total")
      ]),

      m( "tr", [
        app.vm.list.map((test, index) => {
          return m( "td", `${test} ms` )
        })
      ])
    ]),

    m( "span", `${app.vm.mongo.length} tests ran`)
  ]
}

//initialize the application
m.mount(document.body, {
  controller: app.controller,
  view: app.view
})