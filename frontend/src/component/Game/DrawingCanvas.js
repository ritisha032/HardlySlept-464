import React, { useState, useRef, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton,WhatsappShareButton,LinkedinShareButton } from 'react-share';
import './DrawingCanvas.css'
// import Slider from '@mui/material-next/Slider'
import pencilIcon from '../Assets/pensil.svg'
import eraserIcon from '../Assets/eraser.svg'
import undoIcon from '../Assets/undo.svg'
import redoIcon from '../Assets/redo.svg'
import downloadIcon from '../Assets/download.svg'
import shareIcon from '../Assets/share.svg'
import clearIcon from '../Assets/clear.svg'

// import io from 'socket.io-client';
// const socket = io.connect('http://localhost:5000');

const CanvasComponent = () => {

  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penSize, setPenSize] = useState(3);
  const [penColor, setPenColor] = useState('black');
  const [isEraser, setIsEraser] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [shapeType, setShapeType] = useState('Pen');
  const [startX,setStartX]=useState(0);
  const [startY,setStartY]=useState(0);
  const [URL,setURL]=useState('');

  useEffect(()=>{
    // console.log(canvasRef.current.toDataURL());
    setHistory([...history,canvasRef.current.toDataURL()]) //pushing blank canvas in array....
    setCurrentStep(0);
    // console.log(currentStep + " "+ history.length);
  },[])


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);

    ctx.lineWidth = penSize; 
    ctx.strokeStyle = penColor;
    ctx.strokeColor = penColor;

    // socket.on('draw', (data) => {
    //   drawFromSocket(data);
    // });

    // socket.on('clear', () => {
    //   clearCanvas();
    // });

  }, [penSize, penColor]);

  // const drawFromSocket = (data) => {
  //   const { x, y, color, size, eraser } = data;

  //   context.lineWidth = size;
  //   context.strokeStyle = eraser ? 'white' : color;
  //   context.lineTo(x, y);
  //   context.stroke();
  // };

 const uploadImage = () => {

    setIsShare(!isShare);

    if(!isShare){const data = new FormData()
    data.append("file", history[currentStep])
    data.append("upload_preset", "aj637061")
    data.append("cloud_name","drxocmkpu")
    fetch("  https://api.cloudinary.com/v1_1/drxocmkpu/image/upload",{
    method:"post",
    body: data
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data.url);
    setURL(data.url)
    })
    .catch(err => console.log(err))}
}


// ----------------------------pen function starts------------------------------------------
  const startDrawing = (e) => {

    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    setStartX(offsetX);
    setStartY(offsetY);
    
    // const data = {
    //   x: offsetX,
    //   y: offsetY,
    //   color: penColor,
    //   size: penSize,
    //   eraser: isEraser,
    //   type:shapeType,
    // };

    // socket.emit('start', data);
  };

  const draw = (e) => {

    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    if (isEraser) {
      context.strokeStyle='white';
      context.lineTo(offsetX, offsetY);
      context.stroke();
    } 
    
    else if(shapeType=='Pen') {
      context.strokeStyle = penColor;
      context.lineTo(offsetX, offsetY);
      context.stroke();
    }
    else if(shapeType=='rectangle'){
      const prevStepImage = new Image();
        prevStepImage.src = history[currentStep];
        prevStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(prevStepImage, 0, 0);
      }
        context.strokeStyle = penColor;
        context.strokeRect(startX, startY, offsetX -startX,offsetY-startY);
        context.moveTo(startX, startY);
    }

    else if(shapeType=='circle'){
      console.log(1);
      const prevStepImage = new Image();
        prevStepImage.src = history[currentStep];
        prevStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(prevStepImage, 0, 0);
      }
        context.strokeStyle = penColor;
        const radius = Math.sqrt(Math.pow(offsetX - startX, 2) + Math.pow(offsetY- startY, 2));
        context.beginPath();
        context.arc(startX,startY, radius, 0, 2 * Math.PI);
        context.moveTo(startX, startY);
        context.stroke();
    }

    else if(shapeType=='ellipse'){
      const prevStepImage = new Image();
        prevStepImage.src = history[currentStep];
        prevStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(prevStepImage, 0, 0);
      }

      context.strokeStyle = penColor;
      const centerX = (startX + offsetX) / 2;
      const centerY = (startY + offsetY) / 2;
      const radiusX = Math.abs(offsetX - startX) / 2;
      const radiusY = Math.abs(offsetY - startY) / 2;

      context.beginPath();
      context.ellipse(centerX, centerY,radiusX,radiusY, 0, 0, 2 * Math.PI);
      context.moveTo(startX, startY);
      context.stroke();
    }

    // else if(shapeType=='curvedLine'){
    //   const prevStepImage = new Image();
    //     prevStepImage.src = history[currentStep];
    //     prevStepImage.onload = () => {
    //     context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //     context.drawImage(prevStepImage, 0, 0);
    //   }

    //   context.strokeStyle = penColor;
    //   // context.beginPath();
    //   // context.moveTo(startX, startY);
    //   context.quadraticCurveTo(200, 1000, offsetX, offsetY);
    //   context.moveTo(startX, startY);
    //   context.stroke();
    // }



    // else if(shapeType=='trapezium'){

    //   const prevStepImage = new Image();
    //     prevStepImage.src = history[currentStep];
    //     prevStepImage.onload = () => {
    //     context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //     context.drawImage(prevStepImage, 0, 0);
    //   }

    //   context.strokeStyle = penColor;
    //   const dx=(0.25)*(offsetX-startX);
    //   context.moveTo(startX + dx , startY);
    //   context.lineTo(offsetX - dx , startY);
    //   context.lineTo(offsetX , offsetY);
    //   context.lineTo(startX , offsetY);
    //   context.lineTo(startX + dx, startY);
    //   context.stroke();
    //   context.moveTo(startX, startY);
    //   context.closePath();
    // }

    // else if(shapeType=='line'){
    //   console.log(0);
    //   const prevStepImage = new Image();
    //     prevStepImage.src = history[currentStep];
    //     prevStepImage.onload =  () => {
    //     context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //     context.drawImage(prevStepImage, 0, 0);
    //     console.log(1);
    //   }
    //   console.log(2);
    //   context.strokeStyle = penColor;
    //   context.lineTo(offsetX, offsetY);
    //   context.moveTo(startX, startY);
    //   context.stroke();
    //   context.closePath();
    // }


    // const data = {
    //   x: offsetX,
    //   y: offsetY,
    //   color: penColor,
    //   size: penSize,
    //   eraser: isEraser,
    //   type:shapeType,
    // };

    // socket.emit('draw', data);
  };

  const endDrawing = (e) => {

    const { offsetX, offsetY } = e.nativeEvent;
     context.strokeStyle = penColor;

    if(shapeType=='line'){
      context.lineTo(offsetX, offsetY);
    }

    else if(shapeType=='rectangle'){
       context.strokeRect(startX, startY, offsetX -startX,offsetY-startY);
    }

    else if(shapeType=='circle'){
          const radius = Math.sqrt(Math.pow(offsetX - startX, 2) + Math.pow(offsetY- startY, 2));
          context.beginPath();
          context.arc(startX,startY, radius, 0, 2 * Math.PI);
    }

    else if(shapeType=='ellipse'){
      const centerX = (startX + offsetX) / 2;
      const centerY = (startY + offsetY) / 2;
      const radiusX = Math.abs(offsetX - startX) / 2;
      const radiusY = Math.abs(offsetY - startY) / 2;

      context.beginPath();
      context.ellipse(centerX, centerY,radiusX,radiusY, 0, 0, 2 * Math.PI);
    }

    else if(shapeType=='trapezium'){
      const dx=(0.25)*(offsetX-startX);
      // context.beginPath();
      context.moveTo(startX + dx , startY);
      context.lineTo(offsetX - dx , startY);
      context.lineTo(offsetX , offsetY);
      context.lineTo(startX , offsetY);
      context.lineTo(startX + dx, startY);
    }

    else if(shapeType=='curveLine'){
      // const centerX = (startX + offsetX) / 2;
      // const centerY = (startY + offsetY) / 2;
      // const radius = Math.sqrt(Math.pow(offsetX - startX, 2) + Math.pow(offsetY - startY, 2))/2;

      // context.beginPath();
      // context.arc(centerX, centerY, radius, 0, Math.PI, false);

    context.beginPath();
    context.moveTo(startX, startY);
    context.quadraticCurveTo(65, 35, offsetX, offsetY);
    }

    context.stroke();
    context.closePath();
    setIsDrawing(false);

    // const data = {
    //   x: offsetX,
    //   y: offsetY,
    //   color: penColor,
    //   size: penSize,
    //   eraser: isEraser,
    //   type:shapeType,
    // };

    // socket.emit('end', data);
  
    //remove useless canvas...
    if(currentStep<history.length-1){
      while(currentStep!=history.length-1){
        history.pop();
      }
    }
    // console.log(history[currentStep]);
    // console.log(currentStep + " "+ history.length);
    // console.log(canvasRef.current.toDataURL());
    setHistory([...history,canvasRef.current.toDataURL('image/png')])
    setCurrentStep(currentStep+1);
    // console.log(history[currentStep]);
    console.log(currentStep + " "+ history.length);
  };

  const handleShapeChange = (e) => {
    setShapeType(e.target.value);
  };

  //-------------clear function------------------------------------

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory([...history,canvasRef.current.toDataURL()])
    setCurrentStep(currentStep+1);
    // socket.emit('clear');
  };
  //-------------------Undo redo------------------------------------

  const undo = () => {
    console.log(currentStep);
    if (currentStep>0) {
      const prevStepImage = new Image();
        prevStepImage.src = history[currentStep-1];
        prevStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(prevStepImage, 0, 0);
      }
      setCurrentStep(currentStep-1);
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      const nextStepImage = new Image();
      nextStepImage.src = history[currentStep + 1];
      nextStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(nextStepImage, 0, 0);
      }
    }
    setCurrentStep(currentStep + 1);
  };
  
  // ------------------------download drawing----------------------------

  const download=(event)=>{
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'MyDraw.png';
      a.click();
  }

  // const toggleShare = () => {
    
  // };

  //-------------------------html-----------------------------------------
  return (
      <div>
        
        <canvas
          ref={canvasRef}
          height={500}
          width={500}
          className='canvas animated-div'
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          // onMouseLeave={endDrawing}
        ></canvas>
        
        <div className='tool-cont animated-div'>

              <div>
                <input
                  type="range" min="2" max="20" value={penSize} className='pen-size'
                  onChange={(e) => setPenSize(parseInt(e.target.value))}
                />
              
              </div>

              <div>
                  <input className='colorPicker'
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                  />
              </div>

              <div onClick={() => setIsEraser(!isEraser)}>
                 <img src={isEraser?pencilIcon:eraserIcon} className='img' alt/>
              </div>

              <select onChange={handleShapeChange} value={shapeType} className='tool-list'>
                <option value="Pen">Pen</option>
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="line">Line</option>
                <option value="ellipse">Ellipse</option>
                <option value="trapezium">Trapezium</option>
                <option value="curveLine">Curve Line</option>
              </select>

                <div onClick={undo}><img src={undoIcon} className='img' alt/></div>
                <div onClick={redo}><img src={redoIcon} className='img' alt/></div>
                <div onClick={download}><img src={downloadIcon} className='img' alt/></div>
                <div onClick={clearCanvas}><img src={clearIcon} className='img' alt/></div>
                <div onClick={uploadImage}><img src={shareIcon} className='img'></img></div>
              </div>

              {isShare?<div className='social-cont animated-div'>
                  <div className='preview'><img className='preview' src={history[currentStep]}></img></div>
                  <div className='shareButtons'>
                       <FacebookShareButton url={'https://res.cloudinary.com/drxocmkpu/image/upload/f_auto,q_auto/v1/canvas/rqfcadtf8vcqbymoussq'}>
                        <button>Facebook</button>
                      </FacebookShareButton>

                      <TwitterShareButton url={URL}>
                        <button>Twitter</button>
                      </TwitterShareButton>

                      <WhatsappShareButton url={URL}>
                        <button>Whatsapp</button>
                      </WhatsappShareButton>

                      <LinkedinShareButton url={URL}>
                        <button target='blank'>Email</button>
                      </LinkedinShareButton>
                  </div>
                 
                </div>:null}
    </div>
  );
};

export default CanvasComponent;
