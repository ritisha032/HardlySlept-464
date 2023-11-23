import React, { useState, useRef, useEffect , useContext } from 'react';
import { FacebookShareButton, TwitterShareButton,WhatsappShareButton,LinkedinShareButton } from 'react-share';
import './DrawingCanvas.css'
import SocketContext from '../../context/SocketContext';
//icons import
import pencilIcon from '../Assets/pensil.svg'
import eraserIcon from '../Assets/eraser.svg'
import closeIcon from '../Assets/close.svg'
import colorFillIcon from '../Assets/colorFill.svg'
import undoIcon from '../Assets/undo.svg'
import redoIcon from '../Assets/redo.svg'
import downloadIcon from '../Assets/download.svg'
import shareIcon from '../Assets/share.svg'
import clearIcon from '../Assets/clear.svg'
import lineIcon from '../Assets/line.svg'
import shapesIcon from '../Assets/shapes.svg'
import rectIcon from '../Assets/rectangle.svg'
import circleIcon from '../Assets/circle.svg'
import ellipseIcon from '../Assets/ellipse.svg'
import trapIcon from '../Assets/trapezium.svg'
import curveIcon from '../Assets/curve.svg'


const CanvasComponent = () => {
  const {socket} = useContext(SocketContext)
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penSize, setPenSize] = useState(3);
  const [penColor, setPenColor] = useState('black');
  const [isEraser, setIsEraser] = useState(false);
  const [isBrush,setIsBrush]=useState(false);
  const [isFillColor,setIsFillColor]=useState(false);
  const [isShape,setIsShape]=useState(false);
  const [isShare, setIsShare] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [shapeType, setShapeType] = useState('Pen');
  const [startX,setStartX]=useState(0);
  const [startY,setStartY]=useState(0);
  const [URL,setURL]=useState('');
  var i=0;
  useEffect(()=>{
    // console.log(canvasRef.current.toDataURL());
    if(context!=null && i==0){
      console.log("useEffect History")
      context.fillStyle='white';
      context.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
      setHistory([...history,canvasRef.current.toDataURL()]) //pushing blank canvas in array....
      setCurrentStep(0);
      i++;
    }
    
    // console.log(currentStep + " "+ history.length);
  },[context])

  useEffect(()=>{
    if(context!=null){
      socket.on('receive_canvas_data',(data)=>{
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
        const targetColor= getColorAtPixel(offsetX, offsetY);
        const replacementColor = [255, 0, 0];

        if (targetColor !== `rgb(${replacementColor[0]}, ${replacementColor[1]}, ${replacementColor[2]})`) {
            floodFill(offsetX, offsetY, targetColor, replacementColor);
        }

         if(currentStep<history.length-1){
          while(currentStep!=history.length-1){
            history.pop();
          }
        }
      setHistory([...history,canvasRef.current.toDataURL('image/png')])
      setCurrentStep(currentStep+1);
      //console.log(history[currentStep]);
      console.log(currentStep + " "+ history.length);   
    }

    else{
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);

      setStartX(offsetX);
      setStartY(offsetY);
    }

    const data = {
        offsetX: offsetX,
        offsetY: offsetY,
        penColor: penColor,
        penSize: penSize,
        isEraser: isEraser,
        isFillColor:isFillColor,
        shapeType:shapeType,
        isDrawing:true,
        function :'startDrawingsocket'
      };

      socket.emit('send_canvas_data', data);
  };

  function startDrawingsocket (data){

    if(data.isFillColor){
        const targetColor= getColorAtPixel(data.offsetX, data.offsetY);
        const replacementColor = [255, 0, 0];

        if (targetColor !== `rgb(${replacementColor[0]}, ${replacementColor[1]}, ${replacementColor[2]})`) {
            floodFill(data.offsetX, data.offsetY, targetColor, replacementColor);
        }
    }

    else{
      console.log("start drawing")
      console.log(data);
      context.beginPath();
      context.moveTo(data.offsetX, data.offsetY);
    }
    
    
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
      function :'drawsocket'
    };

    socket.emit('send_canvas_data', data);

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
  };

  const endDrawing = (e) => {

    const { offsetX, offsetY } = e.nativeEvent;
    if(isFillColor) return;
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
      shapeType:shapeType,
      isDrawing:false,
      function :'endDrawingSocket'
    };

    socket.emit('send_canvas_data', data);
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
      if(data.isFillColor) return;
      // console.log("end drawing")
      // console.log(data);
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
    if(isEraser){
      setShapeType("Pen");
    }
    else {
      setShapeType(e.target.name);
    }
  };

  //-----------------ColorFill Function---------------------------

   const getColorAtPixel = (x, y) => {
    // const context = contextRef.current;
    const pixel = context.getImageData(x, y, 1, 1).data;
    return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  };

  const floodFill = (startX, startY, targetColor, replacementColor) => {
    console.log(startX+" "+startY);
    // const context = contextRef.current;
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const stack = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const { x, y } = stack.pop();
      // console.log(x+" "+y);
      // console.log("working");
      if (x < 0 || x >= canvasRef.current.width || y < 0 || y >= canvasRef.current.height) {
        continue;
      }

      const currentIndex = (y * canvasRef.current.width + x) * 4;
      const currentColor = `rgb(${imageData.data[currentIndex]}, ${imageData.data[currentIndex + 1]}, ${imageData.data[currentIndex + 2]})`;

      if (currentColor === targetColor) {
        context.fillStyle = `rgb(${replacementColor[0]}, ${replacementColor[1]}, ${replacementColor[2]})`;
        context.fillRect(x, y, 1, 1);

        imageData.data[currentIndex] = replacementColor[0];
        imageData.data[currentIndex + 1] = replacementColor[1];
        imageData.data[currentIndex + 2] = replacementColor[2];

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      }
    }
  };

  //-------------clear function------------------------------------

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHistory([...history,canvasRef.current.toDataURL()])
    setCurrentStep(currentStep+1);

      const data = {
        function :'clearCanvasSocket'
      };
    socket.emit('send_canvas_data', data);
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

      socket.emit('send_canvas_data', data);
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
      socket.emit('send_canvas_data', data);
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

  //------------------------button press-------------------------------

  const PenButton=()=>{
    setIsBrush(!isBrush);
    setShapeType("Pen");
  }

  const EraserButton=()=>{
    setIsEraser(!isEraser)
    setShapeType("Pen");
  }
  
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
      <div className='canvas-cont'>
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

              <div onClick={PenButton}>
                 <img src={pencilIcon} className='img' alt/>
              </div>

              <div onClick={EraserButton}>
                 <img src={isEraser?closeIcon:eraserIcon} className='img' alt/>
              </div>

              <div onClick={() => setIsFillColor(!isFillColor)}><img src={!isFillColor?colorFillIcon:closeIcon} className='img' alt/></div>
              
              <div onClick={()=>setIsShape(!isShape)}>
                 <img src={shapesIcon} className='img' alt/>
              </div>
            
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

              {isEraser?<div className='eraser-cont animated-div'>
                <input
                  type="range"
                  min="2"
                  max="20" 
                  value={penSize} 
                  className='pen-size'
                  onChange={(e) => setPenSize(parseInt(e.target.value))}
                />
              </div>:null}
              
              {isBrush && (!isEraser)?<div className='brush-cont animated-div'>
                <input
                  type="range"
                  min="2"
                  max="20" 
                  value={penSize} 
                  className='pen-size'
                  onChange={(e) => setPenSize(parseInt(e.target.value))}
                />
                <input className='colorPicker'
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                  />
              </div>:null}

              {isShape?<div className='shape-cont animated-div'>
              <img className='img' name="Pen" onClick={handleShapeChange} src={pencilIcon}></img>
              <img className='img' name="line" onClick={handleShapeChange} src={lineIcon}></img>
              <img className='img' name="rectangle" onClick={handleShapeChange} src={rectIcon}></img>
              <img className='img' name="circle" onClick={handleShapeChange} src={circleIcon}></img>
              <img className='img' name="ellipse" onClick={handleShapeChange} src={ellipseIcon}></img>
              <img className='img' name="trapezium" onClick={handleShapeChange} src={trapIcon}></img>
              <img className='img' name="curveLine" onClick={handleShapeChange} src={curveIcon}></img>
              </div>:null}
    </div>
  );
};

export default CanvasComponent;
