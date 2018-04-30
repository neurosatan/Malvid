'use strict'

const { render } = require('react-dom')
const { Provider } = require('react-redux')
const { css } = require('glamor')
const { isHotkey } = require('is-hotkey')
const createHistory = require('history').createHashHistory

const h = require('./utils/h')
const createStore = require('./utils/createStore')
const parsePath = require('./utils/parsePath')
const requestState = require('./utils/requestState')
const errorToState = require('./utils/errorToState')
const enhanceState = require('./utils/enhanceState')
const isInput = require('./utils/isInput')
const createNavigation = require('./utils/createNavigation')
const createRoute = require('./utils/createRoute')
const stopEvent = require('./utils/stopEvent')
const normalize = require('./styles/normalize')
const atomOneLight = require('./styles/atomOneLight')
const markdown = require('./styles/markdown')
const global = require('./styles/global')
const { setRoute, setFilter } = require('./actions')

const Main = require('./components/Main')

css.insert(normalize)
css.insert(atomOneLight)
css.insert(markdown)
css.insert(global)

const init = (initialState) => createStore(initialState, (err, store) => {

	if (err != null) throw err

	const history = createHistory()

	// Set the state based on the location
	const parseLocation = (location) => {

		const state = store.getState()
		const { components } = enhanceState(state)
		const parsedPath = parsePath(location.pathname, components)
		const action = setRoute(parsedPath.componentId, parsedPath.tabId)

		store.dispatch(action)

	}

	// Parse the initial location
	parseLocation(history.location)

	// Reparse the location when the user navigates
	history.listen(parseLocation)

	const html = h(Provider, { store }, h(Main))
	const root = document.querySelector('#main')

	render(html, root)

	// Curry the hotkey string for better performance
	const isClearKey = isHotkey('esc')
	const isConfirmKey = isHotkey('enter')
	const isPrevKey = isHotkey('up')
	const isNextKey = isHotkey('down')

	const navigateToComponent = (nextComponent) => {

		if (nextComponent == null) return

		const state = store.getState()
		const { currentTab } = enhanceState(state)

		location.href = createRoute(nextComponent.id, currentTab.id)

	}

	const clearFilter = () => store.dispatch(setFilter(''))
	const focusFilter = () => document.querySelector('#filter').focus()

	document.documentElement.addEventListener('keydown', (e) => {

		if (isClearKey(e) === true) {
			clearFilter()
			focusFilter()
			return stopEvent(e)
		}

		if (isConfirmKey(e) === true && isInput(e.target) === true) {
			navigateToComponent(createNavigation(store).firstComponent())
			return stopEvent(e)
		}

		if (isPrevKey(e) === true) {
			navigateToComponent(createNavigation(store).prevComponent())
			return stopEvent(e)
		}

		if (isNextKey(e) === true) {
			navigateToComponent(createNavigation(store).nextComponent())
			return stopEvent(e)
		}

	})

})

requestState(location.href)
	.then(init, (err) => init(errorToState(err)))
	.catch(console.error)