import './app.scss';
import {initializeChat} from './chat';

let style=document.createElement('link');
style.href='https://fonts.googleapis.com/css?family=Roboto';
style.rel='stylesheet';
document.getElementsByTagName('head')[0].appendChild(style);
let metaTag=document.createElement('meta');
metaTag.name = "viewport";
metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
document.getElementsByTagName('head')[0].appendChild(metaTag);
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAY0em10HRk_AlQ_1lm6RSLT55y2CMssOM');
document.getElementsByTagName('head')[0].appendChild(script);

initializeChat();