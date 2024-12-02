import FileUploader from "./components/FileUpload";
import "./App.css";

export default function App() {
  return (
    <div id="root" className="main">
      <h1>막짬 출근 보고</h1>
      <FileUploader />
    </div>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
