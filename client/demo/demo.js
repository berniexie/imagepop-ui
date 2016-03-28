//Demo page - will show the before and after effect of popping an image
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PageTemplate from '../shared/components/PageTemplate.js';
import DemoPageContent from './components/DemoPageContent.js';

//images to be loaded on demo page
var images = [[{smallImgSrc: "./img/beach-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/beach-after.png",
                highImgSrc: "",
                befImgSrc: "./img/beach-before.png"},
                {smallImgSrc: "./img/doheny-small.png",
                lowImgSrc: "./img/doheny-low.png",
                medImgSrc: "./img/doheny-medium.png",
                highImgSrc: "./img/doheny-high.png",
                befImgSrc: "./img/doheny-before.png"},
                {smallImgSrc: "./img/building-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/building-after.png",
                highImgSrc: "",
                befImgSrc: "./img/building-before.png"}],
                [{smallImgSrc: "./img/jellies-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/jellies-after.png",
                highImgSrc: "",
                befImgSrc: "./img/jellies-before.png"},
                {smallImgSrc: "./img/kelp-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/kelp-after.png",
                highImgSrc: "",
                befImgSrc: "./img/kelp-before.png"},
                {smallImgSrc: "./img/shark-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/shark-after.png",
                highImgSrc: "",
                befImgSrc: "./img/shark-before.png"}],
                [{smallImgSrc: "./img/ships-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/ships-after.png",
                highImgSrc: "",
                befImgSrc: "./img/ships-before.png"},
                {smallImgSrc: "./img/tanks-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/tanks-after.png",
                highImgSrc: "",
                befImgSrc: "./img/tanks-before.png"},
                {smallImgSrc: "./img/waves-small.png",
                lowImgSrc: "",
                medImgSrc: "./img/waves-after.png",
                highImgSrc: "",
                befImgSrc: "./img/waves-before.png"}]];

export default class Demo extends Component {
  render () {
    console.log("in demo render");
    return (
        <PageTemplate title="Gallery" 
            subtitle="Select an image below to see what image|pop can do." >
          <DemoPageContent demoImages={images}/>
        </PageTemplate>,
    );
  }
}

