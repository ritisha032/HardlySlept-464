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

import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const CanvasComponent = () => {

  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penSize, setPenSize] = useState(3);
  const [penColor, setPenColor] = useState('black');
  const [isEraser, setIsEraser] = useState(false);
  const [isFillColor,setIsFillColor]=useState(false);
  const [isShare, setIsShare] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [shapeType, setShapeType] = useState('Pen');
  const [startX,setStartX]=useState(0);
  const [startY,setStartY]=useState(0);
  const [URL,setURL]=useState('');

  useEffect(()=>{
    // console.log(canvasRef.current.toDataURL());
    console.log("useEffect History")
    setHistory([...history,canvasRef.current.toDataURL()]) //pushing blank canvas in array....
    setCurrentStep(0);
    // console.log(currentStep + " "+ history.length);
  },[])

  useEffect(()=>{
    if(context!=null){
      socket.on('receive_data',(data)=>{
        console.log("getting info");
        setPenSize(data.penSize);
      if(data.function=='startDrawingsocket'){
        startDrawingsocket(data);
      }
      else if(data.function=='drawsocket'){
        drawsocket(data);
      }
      else if(data.function=='endDrawingSocket'){
        endDrawingSocket(data);
      }
      else if(data.function=='undoRedoSocket'){
         undoRedoSocket(data);
      }
      else if(data.function=='clearCanvasSocket'){
        clearCanvasSocket();
      }
    })
    }
  },[context])

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    console.log("use Effect of canvas");
    ctx.lineWidth = penSize; 
    ctx.strokeStyle = penColor;
    ctx.strokeColor = penColor;

  }, [penSize, penColor]);

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

    if(isFillColor){
        const pixel = canvasRef.current.getContext('2d').getImageData(offsetX,offsetY, 1, 1).data;
        const rgb = { 
          r:pixel[0],
          g:pixel[1],
          b:pixel[2]
        };
        // console.log( rgb.r + " " + rgb.g + " "+ rgb.b);
        // floodFill(offsetX, offsetY, [rgb.r,rgb.g,rgb.b], [255, 0, 0]);
    }

    else{
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);

      setStartX(offsetX);
      setStartY(offsetY);
      const data = {
        offsetX: offsetX,
        offsetY: offsetY,
        penColor: penColor,
        penSize: penSize,
        isEraser: isEraser,
        shapeType:shapeType,
        isDrawing:true,
        dataURL:history[currentStep],
        function :'startDrawingsocket'
      };

      socket.emit('send_data', data);
    }
  };

  function startDrawingsocket (data){
    console.log("start drawing")
    console.log(data);
    // console.log(typeof data)
    context.beginPath();
    // console.log(data["offsetX"] + " " + data["offsetY"]);
    context.moveTo(data.offsetX, data.offsetY);
    
    //setIsDrawing(true);
    // setStartX(data.offsetX);
    // setStartY(data.offsetY); 
  };

  const draw = (e) => {

    if (!isDrawing || isFillColor) return;
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

    const data = {
      startX:startX,
      startY:startY,
      offsetX: offsetX,
      offsetY: offsetY,
      penColor: penColor,
      penSize: penSize,
      isEraser: isEraser,
      shapeType:shapeType,
      isDrawing:isDrawing,
      dataURL:history[currentStep],
      function :'drawsocket'
    };

    socket.emit('send_data', data);


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

  };

  function drawsocket (data){
      console.log("Drawing")
      console.log(data);
      if (!data.isDrawing) return;
    
      if (data.isEraser) {
        context.strokeStyle='white';
        context.lineTo(data.offsetX, data.offsetY);
        context.stroke();
      } 
    
      else if(data.shapeType=='Pen') {
        context.strokeStyle = data.penColor;
        context.lineTo(data.offsetX, data.offsetY);
        context.stroke();
      }

    else if(data.shapeType=='rectangle'){
    
      const prevStepImage = new Image();
        prevStepImage.src =data.dataURL;
        prevStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(prevStepImage, 0, 0);
      }
        context.strokeStyle = data.penColor;
        context.strokeRect(data.startX, data.startY, data.offsetX -data.startX,data.offsetY-data.startY);
        context.moveTo(data.startX, data.startY);
    }

    else if(data.shapeType=='circle'){
      console.log(1);
      const prevStepImage = new Image();
        prevStepImage.src =data.dataURL;
        prevStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(prevStepImage, 0, 0);
      }
        context.strokeStyle = data.penColor;
        const radius = Math.sqrt(Math.pow(data.offsetX - data.startX, 2) + Math.pow(data.offsetY- data.startY, 2));
        context.beginPath();
        context.arc(data.startX,data.startY, radius, 0, 2 * Math.PI);
        context.moveTo(data.startX, data.startY);
        context.stroke();
    }
    else if(data.shapeType=='ellipse'){
        const prevStepImage = new Image();
        prevStepImage.src = data.dataURL;
        prevStepImage.onload = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(prevStepImage, 0, 0);
      }

      context.strokeStyle = data.penColor;
      const centerX = (data.startX + data.offsetX) / 2;
      const centerY = (data.startY + data.offsetY) / 2;
      const radiusX = Math.abs(data.offsetX - data.startX) / 2;
      const radiusY = Math.abs(data.offsetY - data.startY) / 2;

      context.beginPath();
      context.ellipse(centerX, centerY,radiusX,radiusY, 0, 0, 2 * Math.PI);
      context.moveTo(data.startX, data.startY);
      context.stroke();
    }
  };

  const endDrawing = (e) => {

    const { offsetX, offsetY } = e.nativeEvent;
    // context.strokeStyle = penColor;

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
      context.beginPath();
      context.moveTo(startX, startY);
      context.quadraticCurveTo(65, 35, offsetX, offsetY);
    }

    context.stroke();
    context.closePath();

    const data = {
      startX:startX,
      startY:startY,
      offsetX: offsetX,
      offsetY: offsetY,
      penColor: penColor,
      penSize: penSize,
      isEraser: isEraser,
      dataURL:history[currentStep],
      shapeType:shapeType,
      isDrawing:false,
      function :'endDrawingSocket'
    };

    socket.emit('send_data', data);
    setIsDrawing(false);
      
    //remove useless canvas...
    if(currentStep<history.length-1){
      while(currentStep!=history.length-1){
        history.pop();
      }
    }
    setHistory([...history,canvasRef.current.toDataURL('image/png')])
    setCurrentStep(currentStep+1);
    //console.log(history[currentStep]);
    console.log(currentStep + " "+ history.length);
  };

  function endDrawingSocket (data) {
      console.log("end drawing")
      console.log(data);
      // context.strokeStyle = data.penColor;

    if(data.shapeType=='line'){
      context.lineTo(data.offsetX, data.offsetY);
    }
    
    else if(data.shapeType=='rectangle'){
       context.strokeRect(data.startX, data.startY, data.offsetX-data.startX,data.offsetY-data.startY);
    }

    else if(data.shapeType=='circle'){
          const radius = Math.sqrt(Math.pow(data.offsetX - data.startX, 2) + Math.pow(data.offsetY- data.startY, 2));
          context.beginPath();
          context.arc(data.startX,data.startY, radius, 0, 2 * Math.PI);
    }

    else if(data.shapeType=='ellipse'){
      const centerX = (data.startX + data.offsetX) / 2;
      const centerY = (data.startY + data.offsetY) / 2;
      const radiusX = Math.abs(data.offsetX - data.startX) / 2;
      const radiusY = Math.abs(data.offsetY - data.startY) / 2;

      context.beginPath();
      context.ellipse(centerX, centerY,radiusX,radiusY, 0, 0, 2 * Math.PI);
    }

    else if(data.shapeType=='trapezium'){
      const dx=(0.25)*(data.offsetX-data.startX);
      // context.beginPath();
      context.moveTo(data.startX + dx , data.startY);
      context.lineTo(data.offsetX - dx , data.startY);
      context.lineTo(data.offsetX , data.offsetY);
      context.lineTo(data.startX , data.offsetY);
      context.lineTo(data.startX + dx, data.startY);
    }

    else if(data.shapeType=='curveLine'){
      context.beginPath();
      context.moveTo(data.startX, data.startY);
      context.quadraticCurveTo(150, 20, data.offsetX, data.offsetY);
    }

    context.stroke();
    context.closePath();
    setIsDrawing(false);
      
    //remove useless canvas...
    // if(currentStep<history.length-1){
    //   while(currentStep!=history.length-1){
    //     history.pop();
    //   }
    // }
    // setHistory([...history,canvasRef.current.toDataURL('image/png')])
    // setCurrentStep(currentStep+1);
    // console.log(history[currentStep]);
    // console.log(currentStep + " "+ history.length);
  };

  const handleShapeChange = (e) => {
    setShapeType(e.target.value);
  };

  //-----------------ColorFill Function---------------------------

  // const floodFill = (startX, startY, targetColor, replacementColor) => {
  //     // console.log(targetColor +" "+" " +replacementColor);
  //     const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
  //     const stack = [[startX, startY]];

  //     const getColorIndex = (x, y) => (y * imageData.width + x) * 4;

  //     const isSameColor = (x, y) => {
  //       const index = getColorIndex(x, y);
  //       const r = imageData.data[index];
  //       const g = imageData.data[index + 1];
  //       const b = imageData.data[index + 2];
  //       return r === targetColor[0] && g === targetColor[1] && b === targetColor[2];
  //     };

  //     const setColor = (x, y) => {
  //       const index = getColorIndex(x, y);
  //       imageData.data[index] = replacementColor[0];
  //       imageData.data[index + 1] = replacementColor[1];
  //       imageData.data[index + 2] = replacementColor[2];
  //     };

  //     while (stack.length) {
  //       const [x, y] = stack.pop();

  //       if (isSameColor(x, y)) {
  //         setColor(x, y);

  //         if (x > 0) stack.push([x - 1, y]);
  //         if (x < canvasRef.current.width - 1) stack.push([x + 1, y]);
  //         if (y > 0) stack.push([x, y - 1]);
  //         if (y < canvasRef.current.height - 1) stack.push([x, y + 1]);
  //       }
  //     }

  //     context.putImageData(imageData, 0, 0);
  //   };

  //-------------clear function------------------------------------

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory([...history,canvasRef.current.toDataURL()])
    setCurrentStep(currentStep+1);

      const data = {
        function :'clearCanvasSocket'
      };
    socket.emit('send_data', data);
  };

  function clearCanvasSocket(){
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

      const data = {
      dataURL : history[currentStep-1],
      function :'undoRedoSocket'
      };

      socket.emit('send_data', data);
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
      const data = {
      dataURL : history[currentStep+1],
      function :'undoRedoSocket'
      };
      socket.emit('send_data', data);
      setCurrentStep(currentStep + 1);
    }
  };

  function undoRedoSocket (data) {
      const prevStepImage = new Image();
      prevStepImage.src =data.dataURL;
      prevStepImage.onload = () => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(prevStepImage, 0, 0);  
    }     
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

              <div onClick={() => setIsFillColor(!isFillColor)}><button>Fillcolor</button></div>

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
                       <FacebookShareButton url={URL}>
                        <button>Facebook</button>
                      </FacebookShareButton>

                      <TwitterShareButton url={URL}>
                        <button>Twitter</button>
                      </TwitterShareButton>

                      <WhatsappShareButton url={URL}>
                        <button>Whatsapp</button>
                      </WhatsappShareButton>

                      <LinkedinShareButton url={URL}>
                        <button>LinkedIn</button>
                      </LinkedinShareButton>
                  </div>
                 
                </div>:null}
    </div>
  );
};

export default CanvasComponent;
