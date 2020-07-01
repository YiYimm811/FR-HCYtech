import React, {Component} from 'react';
import {Form, Input, Button, Select, Upload, Spin, Modal, Radio} from 'antd';
import {UPLOAD} from '../ajax/Urls'
import {
    UserOutlined,
    MobileOutlined,
    EnvironmentOutlined,
    MailOutlined,
    LoadingOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {getBase64, beforeUpload} from '../Plugin/UpLoad'
import {UserRegister} from '../ajax/Index'
import logo from "../Images/logo.png";

class Register extends Component {
    state = {
        loading: false,
        imageUrl: '',
        pageLoading: false

    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl: info.file.response.data,
                    loading: false,
                }),
            );
        }
    };

    onUserRegister = (values) => {
        this.setState({
            pageLoading: true
        });

        values.headImgPath = this.state.imageUrl;
        UserRegister(values).then((res) => {
            switch (res.code) {
                case 200:
                    return this.Notice('Success', res.msg);
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
                    title: 'Register successful',
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
        const prefixSelector = (
            <Form.Item name="cardType" noStyle>
                <Select style={{width: 100}}>
                    <Select.Option value="1">ID Card</Select.Option>
                    <Select.Option value="2">Passport</Select.Option>
                </Select>
            </Form.Item>
        );
        const {imageUrl, pageLoading} = this.state;
        return (
            <Spin tip="Loading..." spinning={pageLoading}>
                <div className="text-center padding30">
                    <img src={logo} alt="logo" width="165"/>
                </div>
                <Form className="form" initialValues={{
                    cardType: "1",
                    sex: "1"
                }}
                      onFinish={this.onUserRegister}
                >
                    <Form.Item className="avatar-box" name="headImgPath"
                               rules={[{required: true, message: 'Please upload avatar!'}]}>
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={UPLOAD}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <div className="box-shadow">
                        <Form.Item
                            name='name'
                            rules={[{required: true, message: 'Please input your name!'}]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Name"/>
                        </Form.Item>
                        <Form.Item
                            name='mobile'
                            rules={[{required: true, message: 'Please input your mobile number!'}]}
                        >
                            <Input prefix={<MobileOutlined className="site-form-item-icon"/>}
                                   placeholder=" Mobile Number"/>
                        </Form.Item>
                        <Form.Item
                            name='email'
                            rules={[{required: true, type: 'email', message: 'Please input your Email!'}]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                        </Form.Item>
                        <Form.Item
                            name='idCard'
                            rules={[{required: true, message: 'Please input your ID number!'}]}
                        >
                            <Input addonBefore={prefixSelector} placeholder="ID Number"/>
                        </Form.Item>
                        <Form.Item
                            name="sex"
                            rules={[{required: true, message: 'Please chose your gender!'}]}
                        >
                            <Radio.Group optionType="default">
                                <Radio.Button value="1" style={{width: "50%"}}>Male</Radio.Button>
                                <Radio.Button value="0" style={{width: "50%"}}>Female</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name='address'
                            rules={[{max: 100}]}
                        >
                            <Input prefix={<EnvironmentOutlined className="site-form-item-icon"/>}
                                   placeholder="Home Address"/>
                        </Form.Item>
                    </div>
                    <Form.Item className="text-center btn-box">
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