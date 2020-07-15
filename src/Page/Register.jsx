import React from 'react';
import {Button, Checkbox, Form, Input, Modal, Select, Spin, Upload} from 'antd';
import {UPLOAD} from '../ajax/Urls'
import {IdcardOutlined, LoadingOutlined, MobileOutlined, PlusOutlined, UserOutlined} from '@ant-design/icons';
import {beforeUpload, transformFile} from '../Plugin/UpLoad'
import {getAgreements, UserRegister} from '../ajax/Index'
import logo from "../Images/logo.png";

const props = {
    listType: "picture-card",
    showUploadList: false,
    action: UPLOAD,
    beforeUpload: beforeUpload,
    transformFile: transformFile

}

class Register extends React.Component {
    formRef = React.createRef();
    tipsRef =React.createRef();
    constructor(props) {
        super(props);
        //this.state.agreement='';
        if (window.location.pathname.substring(1)) {
            const array = window.location.pathname.substring(1).split('/');
            this.state.identificationCode = array[0];
            /*if(array.length>1){
                this.state.email = array[1];
            }*/
        }

    }

    state = {
        loading: false,
        pageLoading: false,
        fileList: [
            {
                name: 'xxx.png',
            }
        ]
    };

    Agreement() {
        getAgreements().then((res) => {
            if (res.code === 200) {
                Modal.info({
                    title: 'Agreement',
                    content: (<div className="info" dangerouslySetInnerHTML={{__html: res.data}}></div>),
                })
            }
        })
        // console.log(this.Agreements);

    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'error') {
            this.setState({loading: false});
            console.log(info.file);
            this.Notice('Warning', info.file.error.message)
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if (info.file.response.code === 200) {
                this.formRef.current.setFieldsValue({
                    headImgPath: info.file.response.data,
                });
                this.setState({
                    imageUrl: info.file.response.data,
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                })
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

        values.headImgPath = this.state.imageUrl;
        //   values.name = values.name + values.name2;
        values.identificationCode = this.state.identificationCode;
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

    render() {
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const layout = {
            labelCol: {
                xs: {
                    span: 1,
                },
                sm: {
                    span: 1,
                },
            },
            wrapperCol: {
                xs: {
                    span: 23,
                },
                sm: {
                    span: 23,
                },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 24,
                    offset: 0,
                },
            },
        };
        const prefixSelector = (
            <Form.Item name="cardType" noStyle>
                <Select style={{width: 122,textAlign:'left'}}>
                    <Select.Option value="1"><IdcardOutlined className="site-form-item-icon"/> NRIC</Select.Option>
                    <Select.Option value="2"><IdcardOutlined className="site-form-item-icon"/> Passport</Select.Option>
                </Select>
            </Form.Item>
        );
        const {imageUrl, pageLoading, email} = this.state;
        return (
            <Spin tip="Loading..." spinning={pageLoading}>
                <div className="text-center padding30">
                    <img src={logo} alt="logo" width="165" className="logo"/>
                </div>
                <Form className="form"
                      name="form"
                      ref={this.formRef}
                      {...layout}
                      scrollToFirstError
                      initialValues={{
                          cardType: "1",
                          sex: "1",
                          email: email,
                      }}
                      onFinish={this.onUserRegister}
                >
                    <Form.Item className="avatar-box" name="headImgPath"
                               rules={[{required: true, message: 'Please upload photo'}]}>
                        {/*<ImgCrop rotate>*/}

                        <Upload
                            name="file"
                            className="avatar-uploader"
                            {...props}
                            onChange={this.handleChange}
                        >
                            {/*  {imageUrl ? <div id="imgs" style={{backgroundImage: `url(${imageUrl}`}}></div>: uploadButton}*/}
                            {imageUrl ? <img src={imageUrl} alt="img" id="images" width={'100%'}/> : uploadButton}
                        </Upload>
                        {/* </ImgCrop>*/}
                    </Form.Item>
                    <div className="box-shadow">
                        <div className="Tips" ref={this.tipsRef}>Please upload a recent photograph of yourself without a mask.</div>
                        <Form.Item
                            name='name'
                            rules={[{required: true, message: 'Required field'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Full Name"
                                   maxLength={30}/>
                        </Form.Item>
                        {/*<Form.Item
                            name='name2'
                            label="&nbsp;"
                            rules={[{required: true, message: 'Required field'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Last Name"
                                   maxLength={30}/>
                        </Form.Item>*/}
                        <Form.Item
                            name='mobile'

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
                        {/* <Form.Item
                            name='email'
                            label="&nbsp;"
                            rules={[{required: true, message: 'Required field'}, {
                                type: 'email', message: 'Please input a valid Email'

                            }]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"
                                   maxLength={50} disabled={email}/>
                        </Form.Item>*/}
                        {/* <Form.Item name="cardType" label="&nbsp;"
                                   rules={[{required: true, message: 'Required field'}]}
                        >
                            <Select>
                                <Select.Option
                                    value="1"> <IdcardOutlined className="site-form-item-icon"/> NRIC</Select.Option>
                                <Select.Option prefix={<IdcardOutlined className="site-form-item-icon"/>}
                                               value="2"><IdcardOutlined
                                    className="site-form-item-icon"/> Passport</Select.Option>
                            </Select>
                        </Form.Item>*/}
                        <Form.Item
                            name='idCard'
                            rules={[{required: true, message: 'Required field'}]}
                        >
                            <Input addonBefore={prefixSelector} placeholder="ID Number" maxLength={30}/>
                        </Form.Item>
                        {/* <Form.Item name="sex">
                            <Radio.Group optionType="default" style={{width: "100%", textAlign: "center"}}>
                                <Radio.Button value="1" style={{width: "50%"}}>Male</Radio.Button>
                                <Radio.Button value="0" style={{width: "50%"}}>Female</Radio.Button>
                            </Radio.Group>
                        </Form.Item>*/}
                        {/* <Form.Item name='address' label="&nbsp;&nbsp;">
                            <Input prefix={<EnvironmentOutlined className="site-form-item-icon"/>}
                                   placeholder="Home Address" maxLength={300}/>
                        </Form.Item>*/}
                        <Form.Item>
                            <Form.Item name='agreement' valuePropName="checked" noStyle
                                       rules={[
                                           {validator: (_, value) => value ? Promise.resolve() : Promise.reject('Consent required')},
                                       ]}>
                                <Checkbox>I have read and agreed to the</Checkbox>
                            </Form.Item>
                            <a onClick={this.Agreement}>Privacy Clause</a>.
                        </Form.Item>
                        {/*  <Divider/>
                        <div className="Tips2">Please upload a recent photograph of yourself without a mask.</div>*/}
                    </div>
                    <Form.Item className="text-center btn-box" {...tailFormItemLayout}>
                        <Button type="primary" size="large" className="btn-register" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        )
    }
}

export default Register;