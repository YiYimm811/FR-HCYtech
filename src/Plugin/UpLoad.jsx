import {message} from 'antd';
//import EXIF from "exif-js/exif";

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }

    return isJpgOrPng;


}

export const transformFile=(file)=>{
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
                    // let originWidth = this.width < this.height ? this.width : this.height;
                    // let originHeight = this.width < this.height ? this.width : this.height;
                    //
                    // canvas.width = originWidth;
                    // canvas.height = originHeight;
                    //
                    // let x = (originWidth - this.width) / 2;
                    // let y = (originHeight - this.height) / 2;
                    // context.clearRect(0, 0, originWidth, originHeight);
                    // context.drawImage(img, x, y, this.width, this.height);

                    let originWidth = this.width ;
                    let originHeight =  this.height;

                    canvas.width = originWidth;
                    canvas.height = originHeight;

                    context.clearRect(0, 0, originWidth, originHeight);
                    context.drawImage(img, 0, 0, this.width, this.height);

                    canvas.toBlob((blob) => {
                        let imgFile = new File([blob], file.name, {type: file.type}); // 将blob对象转化为图片文件

                        resolve(imgFile);
                    }, file.type, 0.2); // file压缩的图片类型

                }
            };
        });
    }

export function getUrlToken(name, str) {
   // console.log(str);
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = str.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

