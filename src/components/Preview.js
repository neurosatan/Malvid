'use strict'

const { css } = require('glamor')
const propTypes = require('prop-types')

const h = require('../utils/h')
const getStatus = require('../selectors/getStatus')
const shadowBox = require('../styles/shadowBox')
const { PREVIEW_MIN_HEIGHT, PREVIEW_HEIGHT, INSPECTOR_MIN_HEIGHT } = require('../constants/sizes')

const Toolbar = require('./Toolbar')
const Frame = require('./Frame')

const style = {

	self: css({
		flexShrink: '0',
		display: 'flex',
		minHeight: PREVIEW_MIN_HEIGHT,
		height: `calc(${ PREVIEW_HEIGHT } - var(--size-vertical, 0px))`,
		maxHeight: `calc(100vh - ${ INSPECTOR_MIN_HEIGHT })`
	}),

	shadowBox: css(shadowBox, {
		display: 'flex',
		flexDirection: 'column'
	}),

	iframe: css({
		flexGrow: '1',
		padding: '.5em',
		minHeight: '0',
		border: 'none'
	})

}

module.exports = ({ statuses, currentComponent, hydrate }) => (

	h('div', { className: style.self.toString() },
		h('div', { className: style.shadowBox.toString() },
			h(Toolbar, {
				status: getStatus(statuses, currentComponent),
				label: currentComponent.name,
				url: currentComponent.url
			}),
			h(Frame, {
				id: currentComponent.id,
				url: currentComponent.url,
				hydrate
			})
		)
	)

)

module.exports.displayName = 'Preview'

module.exports.propTypes = {

	statuses: propTypes.object.isRequired,
	currentComponent: propTypes.object.isRequired,
	hydrate: propTypes.func.isRequired

}