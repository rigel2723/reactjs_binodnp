import React, {Component} from 'react';
import './css/Confirmation.css';
export default  class Confirmation extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="confirmation">
        <div className="overlay"></div>
        <div className="modal">
          <div className="modal-content">
            <div className="modal-body">
                <div className="dp-txt">Are you sure you want to delete photo/s?</div>
            </div>
            
            <div className="modal-footer">
              <div className="btn-container">
                <button className="cancel" onClick={() => this.confirmDelete(false)}>
                  
                <img src={require('./../assets/image/close_w.png')} width="27px" draggable="false" />
                &nbsp;Cancel
                </button>
                <button className="ok" onClick={() => this.confirmDelete(true)}>
                <img src={require('./../assets/image/check_w.png')} width="27px" draggable="false" />
                  &nbsp;Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  confirmDelete(val) {
    this.props.confirmDelete(val);
  }

}