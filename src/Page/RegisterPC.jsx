import React from 'react';
import {Button, Checkbox, Form, Input, Modal, Select, Space, Spin, Tooltip, Upload} from 'antd';
import {UPLOAD} from '../ajax/Urls'
import {
    CameraOutlined,
    IdcardOutlined,
    MailOutlined,
    MobileOutlined,
    QuestionCircleOutlined,
    UploadOutlined,
    UserOutlined
} from '@ant-design/icons';
import {beforeUpload, transformFile} from '../Plugin/UpLoad'
import {getAgreements, postPhoto, UserRegister} from '../ajax/Index'
import logo from "../Images/logo.png";
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const props = {
    listType: 'picture',
    action: UPLOAD,
    beforeUpload: beforeUpload,
    transformFile: transformFile,
    className: 'upload-list-inline',
    imageUrl:''
}

class RegisterPC extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
    }

    state = {
        fileList: [],
        pageLoading: false,
        Camera: false,
        dataUri: false,
        isEmailShow: (this.props.identificationCode.length === 10) ? true : false
    };
    Agreement=()=> {
        getAgreements().then((res) => {
            if (res.code === 200) {
                Modal.info({
                    title: 'Privacy Clause',
                    content: (<div className="info" dangerouslySetInnerHTML={{__html: res.data}}></div>),
                    onOk:()=>{
                        this.formRef.current.setFieldsValue({agreement:true})
                    }
                })
            }
        })
    }

    handleChange = info => {
//
        if (info.file.status === 'uploading') {
            let fileList = [...info.fileList];
            fileList = fileList.slice(-1);

            fileList = fileList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.url;
                }
                return file;
            });
            this.setState({fileList});
            return;
        }
        if (info.file.status === 'error') {
            this.setState({
                imageUrl: '',
            })
            this.Notice('Warning', info.file.error.message);
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if (info.file.response.code === 200) {
                this.formRef.current.setFieldsValue({
                    headImgPath: info.file.response.data,
                });
                this.setState({
                    imageUrl: info.file.response.data,
                });

            } else {
                this.setState({

                    imageUrl: '',

                });
                this.Notice('Fail', info.file.response.msg)
            }

        }

    };

    onUserRegister = (values) => {
        this.setState({
            pageLoading: true
        });
        const regExp = /^[STFG]\d{7}[A-Z]$/;
        if (values.cardType === '1' && !regExp.test(values.idCard)) {
            return this.Notice('Fail', 'Please check your NRIC number');
        }
       // values.headImgPath = this.state.imageUrl;
        values.identificationCode = this.props.identificationCode;
        UserRegister(values).then((res) => {
            switch (res.code) {
                case 200:
                    return this.Notice('Success', '');
                case 500:
                    return this.Notice('Warning', res.msg);
                default:
                    return this.Notice('Fail', res.msg);
            }
        }).catch((error) => {
            this.Notice('Warning', 'Please check your network');
        })
    }

    Failed = (values) => {
        values.headImgPath = this.state.imageUrl;
        if (!values.headImgPath) {
            this.setState({Tips: false});
            return false
        }
    }

    Notice = (type, message) => {

        switch (type) {
            case 'Success': {
                return Modal.success({
                    title: 'Register successfully!',
                    content: message,
                    onOk() {
                        window.history.go(0)
                    }
                })
            }
            case 'Fail': {
                this.setState({
                    pageLoading: false
                });
                return Modal.error({
                    title: 'Register failed',
                    content: message,
                })

            }
            case 'Warning': {
                this.setState({
                    pageLoading: false
                });
                return Modal.warning({
                    title: 'Network error',
                    content: message,
                })
            }

        }
    }
    handleTakePhoto = (dataUri) => {
        // Do stuff with the photo...
        console.log('takePhoto' + dataUri);
        this.setState({dataUri:dataUri})
    }
    TakePhoto = (flag) => {
        this.setState({Camera: flag})
    }
    uploadPhoto=()=>{
        let data={
            fileStr:this.state.dataUri
        };
        const fileList={
            uid: '1',
            name: 'photo.png',
            status: 'uploading',
            url: this.state.dataUri,
        }
        this.setState({dataUri: false,Camera: false,fileList:[fileList]});
        postPhoto(data).then(res=>{
            if(res.code===200){
               fileList.status= 'done';
                fileList.url=res.data;
                this.formRef.current.setFieldsValue({
                    headImgPath: res.data,
                });
                this.setState({
                    imageUrl: res.data,
                });
            }else{
                fileList.status= 'error';
            }
            this.setState({fileList:[fileList]});
        }).catch(()=>{
            fileList.status= 'error';
            this.setState({fileList:[fileList]});
        });

    }
    Remake=()=>{
        this.setState({dataUri: false});
    }
    render() {
        const layout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        };
        const formItemLayout={
            wrapperCol: {
                span: 18,
                offset: 6,
            },
        }
        const tailFormItemLayout = {
            wrapperCol: {
                span: 24,
                offset: 0,

            },
        };
        const prefixSelector = (
            <Form.Item name="cardType" noStyle>
                <Select style={{width: 122, textAlign: 'left'}}>
                    <Select.Option value="1"><IdcardOutlined className="site-form-item-icon"/> NRIC/FIN</Select.Option>
                    <Select.Option value="2"><IdcardOutlined className="site-form-item-icon"/> Passport</Select.Option>
                </Select>
            </Form.Item>
        );
        const {pageLoading, dataUri, isEmailShow} = this.state;
        return (
            <Spin tip="Loading..." spinning={pageLoading}>
                <div className="text-center padding30">
                    <img src={logo} alt="logo" width="165" className="logo"/>
                </div>
                <Form className="form-shadow"
                      name="form"
                      ref={this.formRef}
                      {...layout}
                      scrollToFirstError
                      initialValues={{
                          cardType: "1",
                      }}
                      onFinish={this.onUserRegister}
                      onFinishFailed={this.Failed}
                >
                    <Form.Item
                        name='name'
                        label="Full Name"
                        rules={[{required: true, message: 'Required field'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Full Name"
                               maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        name='mobile'
                        label="Mobile Number"
                        rules={[{
                            required: true,
                            message: 'Required field'
                        }, {
                            pattern: new RegExp(/^[0-9]{8}$/),
                            message: 'Please input a valid mobile number'
                        }]}
                    >
                        <Input prefix={<MobileOutlined className="site-form-item-icon"/>}
                               placeholder="Mobile Number" maxLength={8}/>
                    </Form.Item>

                    <Form.Item
                        name='idCard'
                        label="ID Number"
                        rules={[{required: true, message: 'Required field'}, {
                            pattern: new RegExp(/^[A-Za-z0-9]+$/),
                            message: 'Please input a valid ID number'
                        }]}
                    >
                        <Input addonBefore={prefixSelector} placeholder="ID Number" maxLength={30}/>
                    </Form.Item>
                  { isEmailShow&&( <Form.Item name='email'
                               label="Email"
                               rules={[{required: true, message: "Required field"}, {
                        type: "email",
                        message: 'Please input a valid Email'
                    }]}>
                        <Input prefix={<MailOutlined className="site-form-item-icon"/> } placeholder="Email"/>
                    </Form.Item>)}
                    <Form.Item className="avatar-box" name="headImgPath"
                               label={<span>Photograph&nbsp;
                                   <Tooltip title="Please upload a recent photograph of yourself without mask.">
                                        <QuestionCircleOutlined/>
                                   </Tooltip>
                               </span>}
                               rules={[{required: true, message: 'Please upload photo'}]}>

                        <Button className="marginR20" onClick={() => this.TakePhoto(true)}>
                            <CameraOutlined/>Take Photo
                            </Button>
                        <Form.Item noStyle>
                            <Upload name="file"
                                    style={{width: '50%'}}
                                    {...props}
                                    fileList={this.state.fileList}
                                    onChange={this.handleChange}>
                                <Button>
                                    <UploadOutlined/> Upload
                                </Button>

                            </Upload>
                        </Form.Item>
                    </Form.Item>
                    <Modal
                        title="Take Photo"
                        visible={this.state.Camera}
                        onCancel={() => this.TakePhoto(false)}
                        footer={false}
                    >
                        {dataUri&&
                        (<div className='demo-image-preview '>
                            <img src={dataUri} />
                            <Space className="marginT25">
                                <Button onClick={this.Remake}>
                                    <CameraOutlined/>
                                    Remake
                                </Button>
                                <Button  onClick={this.uploadPhoto}><UploadOutlined />Upload</Button>
                            </Space>

                        </div>)}
                        {!dataUri&&<Camera
                            onTakePhoto={(dataUri) => {
                                this.handleTakePhoto(dataUri);
                            }}
                        />}

                    </Modal>
                    <Form.Item  {...formItemLayout} >
                        <Form.Item name='agreement' valuePropName="checked" noStyle
                                   rules={[
                                       {validator: (_, value) => value ? Promise.resolve() : Promise.reject('Consent required')},
                                   ]}>
                            <Checkbox>I have read and agreed to the</Checkbox>
                        </Form.Item>
                        <a onClick={this.Agreement}>Privacy Clause</a>.
                    </Form.Item>

                    <Form.Item className="text-center btn-box" {...tailFormItemLayout}>
                        <Button type="primary" style={{width: 300}} htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        )
    }
}

export default RegisterPC;
