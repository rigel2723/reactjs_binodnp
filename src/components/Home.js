import React from 'react';
import './css/Home.css';
import Upload from './Upload'
import Confirmation from './Confirmation'

export default 
class Home extends React.Component {
  constructor (props) {
    super(props);
    
    // bind event
    this.getList = this.getList.bind(this);
    this.render = this.render.bind(this);
    this.toggleModal = this.toggleModal.bind(this)
    this.selectPhoto = this.selectPhoto.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.deletePhotos = this.deletePhotos.bind(this)
    this.load_more = this.load_more.bind(this)
    this.showConf = this.showConf.bind(this)

    this.state = {
      docList: [],
      showModal: false,
      selectedImage: {},
      perPage: 5,
      currentPage: 0,
      showLoadMore: true,
      showConfirmation: false,
      showNotif: {
        visible: false,
        message: ''
      }
    }

    this.documentsList = []
  }

  render() {
    let showModal = this.state.showModal
    let showConfirmation = this.state.showConfirmation
    let showNotif = this.state.showNotif.visible
    return (
      <div className="App">
        {showNotif &&
          <div className="alert">{this.state.showNotif.message}</div> 
        }
        {
           showModal === true &&
          <Upload toggleModal={this.toggleModal} />
        }
        {
           showConfirmation === true &&
          <Confirmation confirmDelete={this.confirmDelete} />
        }
        <div className="head-container">
          <div className="l-menu">Photos</div>
          <div className="r-menu">
            {Object.keys(this.state.selectedImage).length > 0 &&
              <div className="delete-photo-container" onClick={this.showConf}>
                <img src={require('./../assets/image/delete_w.png')} width="27px" draggable="false" alt="delete" />
                <span>Delete</span>
              </div>
            }
            <div className="upload" onClick={this.toggleModal}>
              <img src={require('./../assets/image/upload_w.png')} width="27px" draggable="false" alt="upload" />
              &nbsp;Upload
            </div>
            <div className="pager">
              <select className="pager-select" onChange={this.updatePage}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
              </select>
              <span className="per-page-lbl">
                &nbsp;per page
              </span>
            </div>
          </div>
        </div>
        <div className="body-container">
          <div className="all-photos"> 
            {Object.keys(this.state.docList).map((item,index)=>{
              return (
                <label htmlFor={ 'cb_id_'+this.state.docList[index].id} key={ 'cb_id_'+this.state.docList[index].id}>
                  <div className="photo-container">
                    <div className="img">
                      <div className="inp-cb">
                        <input type="checkbox" id={'cb_id_'+this.state.docList[index].id} onChange={() => this.selectPhoto(this.state.docList[index])} />
                        <div className="highlight"></div>
                      </div>
                      <img src={this.state.docList[index].raw}  alt="img" />
                    </div>
                    <div className="name">{this.state.docList[index].name}</div>
                    <div className="album">{this.state.docList[index].album}</div>
                  </div>
                </label>
              ); 
            })}
            </div>
            { this.state.showLoadMore &&
              <div>
                <button id="load-more" onClick={this.load_more}>
                <img src={require('./../assets/image/load_more_w.png')} width="27px" draggable="false" alt="load more" />
                  &nbsp;LOAD MORE PHOTOS
                </button>
              </div>
            }
        </div>
      </div>
    );
  }
  confirmDelete(val) {
    this.setState({showConfirmation: false})
    if (val === true) {
      this.deletePhotos()
    }
  }

  showConf() {
    this.setState({showConfirmation: true})
  }

  async load_more() {
    let nextpage  = this.state.currentPage + 1
    await this.setState({currentPage: nextpage})
    await this.getList(false)
  }
  
  componentDidMount() {
    this.getList()
  }

  getList(isInit = true) {
    let skip = this.state.currentPage * this.state.perPage
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skip: skip, limit: this.state.perPage })
    };
    fetch("http://localhost:8888/photos/list", requestOptions)
      .then(res => res.json())
      .then(async (result) => {
        let dataResult = result.documents
        if (!isInit) {
          if (dataResult.length < 1) {
            await this.setState({showLoadMore: false})
          }
          dataResult = this.state.docList.concat(dataResult)
        } else {
          await this.setState({selectedImage: {}})
          await this.setState({showLoadMore: true})
        }
        await this.setState({ docList: dataResult });
      })
  }

  deletePhotos() {
    let selectedPhotos = this.state.selectedImage
    if (Object.keys(selectedPhotos).length < 1) {
      this.showNotification("Please select photo to delete!")
      return false
    }
    let delete_files = []
    for (let i =0; i < Object.keys(selectedPhotos).length; i ++) {
      const index = Object.keys(selectedPhotos)[i]
      const pInfo = selectedPhotos[index]
      delete_files.push({'album' : pInfo.album, documents: pInfo.name})
    }
    const requestOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify(delete_files)
    };
    fetch("http://localhost:8888/photos/", requestOptions)
      .then(res => res.json())
      .then(async (result) => {
        if (result.message.toLowerCase() === 'ok') {
          await this.setState({currentPage: 0})
          await this.getList()
          await this.setState({selectedImage: {}})
          this.showNotification("Success. Photo/s has been deleted!")
        } else {
          this.showNotification('Something went wrong. Please try again')
        }
      })
  }

  async toggleModal(evt) {
    await this.setState({showModal: !this.state.showModal})
    // RELOAD PAGE IF EVT=TRUE
    if (evt === true) {
      await this.setState({ docList: {} });
      await this.setState({currentPage: 0})
      await this.getList()
    }
  }

  selectPhoto(data) {
    const imgId = data.id
    let currState = this.state.selectedImage
    if (typeof currState[imgId] != "undefined") {
      delete currState[imgId]
    } else {
      currState[imgId] = data
    }
    this.setState({selectedImage: currState})
  }
  async updatePage(evt) {
    await this.setState({perPage: evt.target.value})
    await this.setState({currentPage: 0})
    await this.getList()
  }

  showNotification(message) {
    this.setState({showNotif: {message: message, visible: true}})
    setTimeout(() => {
      this.setState({showNotif: {message: "", visible: false}})
    }, 2000)
  }
}
