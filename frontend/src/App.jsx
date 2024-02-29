import axios from "axios";
import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const prediction = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image);

    await axios
      .post("http://localhost:3000/predict", formData)
      .then((response) => {
        console.log(response);
        // Access the prediction result from response.data.data
        setPredictionResult(response.data.data.predicted_class);
      })
      .catch((error) => alert(error.response.data.message));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <label htmlFor="">Select image</label>
      <input
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
      />
      {image && (
        <img
          className="h-[200px] w-[200px] object-cover"
          src={URL.createObjectURL(image)}
          alt=""
        />
      )}
      {image && (
        <div
          onClick={prediction}
          className="mt-6 p-3 text-white bg-black rounded cursor-pointer"
        >
          Predict
        </div>
      )}
      {predictionResult && (
        <div className="mt-4 text-lg">Predicted Class: {predictionResult}</div>
      )}
    </div>
  );
}

export default App;
