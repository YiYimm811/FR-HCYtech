import React from 'react';
import {Button, Checkbox, Form, Input, Modal, Select, Spin, Upload} from 'antd';
import {UPLOAD} from '../ajax/Urls'
import {
    IdcardOutlined,
    LoadingOutlined,
    MailOutlined,
    MobileOutlined,
    PlusOutlined,
    UserOutlined
} from '@ant-design/icons';
import {beforeUpload, getUrlToken} from '../Plugin/UpLoad'
import {UserRegister} from '../ajax/Index'
import logo from "../Images/logo.png";

const props = {
    listType: "picture-card",
    showUploadList: false,
    action: UPLOAD,
    beforeUpload: beforeUpload,
    transformFile(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const canvas = document.createElement('canvas');
                const img = document.createElement('img');
                img.src = reader.result;
                img.onload = function () {
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');

                    let originWidth = this.width < this.height ? this.width : this.height;
                    let originHeight = this.width < this.height ? this.width : this.height;

                    canvas.width = originWidth;
                    canvas.height = originHeight;

                    let x = (originWidth - this.width) / 2;
                    let y = (originHeight - this.height) / 2;
                    context.clearRect(0, 0, originWidth, originHeight);
                    context.drawImage(img, x, y, this.width, this.height);

                    canvas.toBlob((blob) => {
                        let imgFile = new File([blob], file.name, {type: file.type}); // 将blob对象转化为图片文件

                        resolve(imgFile);
                    }, file.type, 0.2); // file压缩的图片类型

                }
            };
        });
    },

}

class Register extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        // this.state.email = window.location.pathname.substring(1);
        this.state.email = getUrlToken('email', window.location.search)
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
        Modal.info({
            title: 'Agreement',
            content: 'Some descriptions',
        })
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
            return this.Notice('Fail', 'Please check your NRIC number！');
        }

        values.headImgPath = this.state.imageUrl;
        values.name = values.name + values.name;
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
            this.Notice('Warning', 'Please check your network！');
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
        const {imageUrl, pageLoading, email, fileList} = this.state;
        return (
            <Spin tip="Loading..." spinning={pageLoading}>
                <div className="text-center padding30">
                    <img src={logo} alt="logo" width="165"/>
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
                    {/*  <p>Please upload a recent photograph of yourself without a mask.</p>*/}
                    <Form.Item className="avatar-box" name="headImgPath"
                               rules={[{required: true, message: 'Please upload photo!'}]}>
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
                    {/*<p>Please upload a recent photograph of yourself without a mask.</p>*/}
                    <div className="box-shadow">
                        <Form.Item
                            name='name'
                            label="&nbsp;"
                            rules={[{required: true, message: 'Required field'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="First Name"
                                   maxLength={30}/>
                        </Form.Item>
                        <Form.Item
                            name='name2'
                            label="&nbsp;"
                            rules={[{required: true, message: 'Required field'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Last Name"
                                   maxLength={30}/>
                        </Form.Item>
                        <Form.Item
                            name='mobile'
                            label="&nbsp;"
                            rules={[{
                                required: true,
                                message: 'Required field!'
                            }, {
                                pattern: new RegExp(/^[0-9]{8}$/),
                                message: 'Please input a valid mobile number!'
                            }]}
                        >
                            <Input prefix={<MobileOutlined className="site-form-item-icon"/>}
                                   placeholder="Mobile Number" maxLength={8}/>
                        </Form.Item>
                        <Form.Item
                            name='email'
                            label="&nbsp;"
                            rules={[{required: true, message: 'Required field'}, {
                                type: 'email', message: 'Please input a valid Email!'

                            }]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"
                                   maxLength={50} disabled={email}/>
                        </Form.Item>
                        <Form.Item name="cardType" label="&nbsp;"
                                   rules={[{required: true, message: 'Required field'}]}
                        >
                            <Select>
                                <Select.Option
                                    value="1"> <IdcardOutlined className="site-form-item-icon"/> NRIC</Select.Option>
                                <Select.Option prefix={<IdcardOutlined className="site-form-item-icon"/>}
                                               value="2"><IdcardOutlined
                                    className="site-form-item-icon"/> Passport</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='idCard'
                            label="&nbsp;"
                            rules={[{required: true, message: 'Required field'}]}
                        >
                            <Input prefix={<IdcardOutlined className="site-form-item-icon"/>}
                                   placeholder="ID Number" maxLength={30}/>
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
                        <Form.Item label="&nbsp;">
                            <Form.Item name='agreement' valuePropName="checked" noStyle
                                       rules={[
                                           {validator: (_, value) => value ? Promise.resolve() : Promise.reject('Consent required')},
                                       ]}>
                                <Checkbox>I have read and agreed to the</Checkbox>
                            </Form.Item>
                            <a onClick={this.Agreement}>Privacy Clause</a>.
                        </Form.Item>
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