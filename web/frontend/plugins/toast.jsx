import React, { Component } from "react";
import { Toast } from "@shopify/polaris";

export const toastRef = React.createRef();
export default class ToastFlash extends Component {
  state = {
    showToast: false,
    message: "",
    error: false,
    duration: 3000,
  };
  showToast = (message, error, duration) => {
    this.setState({
      message: message,
      error: error,
      duration: duration,
      showToast: true,
    });
  };
  toggleToast = () => {
    this.setState(({ showToast }) => ({ showToast: !showToast }));
  };

  render() {
    const { showToast, message, error, duration } = this.state;
    return showToast ? (
      <Toast
        content={message}
        error={error}
        duration={duration}
        onDismiss={this.toggleToast}
      />
    ) : null;
    // return null;
  }
}

export const showToast = (options) => {
  let { message, error, duration } = options;
  if (!error) error = false;
  if (!duration) duration = 3000;
  toastRef.current.showToast(message, error, duration);
};
