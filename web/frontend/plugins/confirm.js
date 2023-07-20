import React, {Component} from 'react'
import {Modal} from '@shopify/polaris'

export const alertRef = React.createRef()
export default class Confirmation extends Component {
	state = {
		open: false,
		danger: false,
		message: '',
		confirm: '',
		cancel: '',
		result: () => {
		}
	}
	open = (options, result) => {
		const {title, message, confirm, cancel, danger} = options
		this.setState({
			message: message,
			confirm: confirm || 'Confirm',
			cancel: cancel || 'Cancel',
			open: true,
			danger: danger || false,
			result: result,
			title: title
		})
	}
	onConfirm = () => {
		this.setState(({open}) => ({
			open: !open
		}), () => {
			this.state.result(true)
		})
	}
	onClose = () => {
		this.setState(({
						   open
					   }) => ({
			open: !open
		}), () => {
			this.state.result(false)
		})
	}

	render() {
		const {
			open,
			message,
			confirm,
			cancel,
			danger,
			title
		} = this.state
		return open ? (
			<Modal
				title={title}
				open={true}
				onClose={
					this.onClose
				}
				primaryAction={{
					content: confirm,
					onAction: this.onConfirm,
					size: 'slim',
					destructive: danger
				}}
				secondaryActions={[{
					content: cancel,
					onAction: this.onClose,
					size: 'slim'
				}]}
			>
				<Modal.Section>
					<p>{message}</p>
				</Modal.Section>
			</Modal>
		) : null
	}
}

export const showConfirm = (options) => {
	return new Promise((resolve, reject) => {
		alertRef.current.open(options, (result) => {
			resolve(result)
		})
	})
}
