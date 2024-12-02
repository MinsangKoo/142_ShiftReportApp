import React, { useState } from "react";
import "./FileUpload.css";
import moment from "moment";
import Moment from "react-moment";
import * as XLSX from "xlsx";
import { View, Text } from "react-native";

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState(moment().format("MM-DD"));
  const [shift, setShift] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState("");

  function getSwings(json) {
    const column1 = [];
    for (var i = 0; i < json.length; i++) {
      var row = json[i];
      column1.push(row[0]);
    }

    var report_date = moment(new Date(date)).format("DD");
    const swings = column1;
    const shifts = [];
    const ojt = [];
    for (var i = 0; i < column1.length; i++) {
      if (json[i][Number(report_date)] == "S") {
        shifts.push([column1[i], json[i][Number(report_date)]]);
      } else if (json[i][Number(report_date)] == "OJS") {
        ojt.push(column1[i]);
      }
    }

    //get 막짬 and OJT's
    var mak_jjam;

    for (var i = shifts.length - 1; i >= 0; i--) {
      if (shifts[i][1] == "S") {
        mak_jjam = shifts[i][0];
        break;
      }
    }
    var mak_jjam_korean = get_korean_name_rank(mak_jjam);

    //get 1짬
    var one_jjam;
    for (var i = 0; i < shifts.length; i++) {
      if (shifts[i][1] == "S") {
        one_jjam = shifts[i][0];
        break;
      }
    }
    var one_jjam_korean = get_korean_name_rank(one_jjam);
    var shift_list = get_shift_list(shifts);
    var ojt_list = get_ojt_list(ojt);

    var report = `
        안녕하십니까! ${mak_jjam_korean}입니다. 
        금일 근무자 명단 및 출퇴근 보고 양식입니다. 
        
        단결! ${one_jjam_korean} 스윙 출근 보고드립니다. 
        근무자: 
${shift_list}
${ojt_list}
        총기 및 탄 드로우 이상 없습니다.
        근무자 건강특이사항: 이상 없습니다. 
        
        단결! ${one_jjam_korean} 스윙 퇴근 보고드립니다. 
        근무자: 
${shift_list}
${ojt_list}
        총기 및 탄 반납 이상 없습니다.
        근무자 건강특이사항: 이상 없습니다. 
        
        수고하십시오!
    `;
    return report;
  }

  function get_korean_name_rank(name) {
    var name_rank = name.split(" ")[0];
    switch (name_rank) {
      case "PV2":
        name_rank = "이병";
        break;
      case "PFC":
        name_rank = "일병";
        break;
      case "CPL":
        name_rank = "상병";
        break;
      case "SGT":
        name_rank = "병장";
        break;
    }
    //var name_korean = name.split(" ")[3];
    var name_korean;
    var name_split = name.split(" ");
    for (var i = 0; i < name_split.length; i++) {
      if (name_split[i][0] == "(" && name_split[i].slice(-1)[0] == ")") {
        name_korean = name_split[i];
        break;
      }
    }
    name_korean = name_korean.slice(1, name_korean.length - 1);
    return name_rank + " " + name_korean;
  }

  function get_ojt_list(ojt) {
    var ojt_list = "";
    for (var i = 0; i < ojt.length; i++) {
      ojt_list = ojt_list + "        " + get_korean_name_rank(ojt[i]) + "(OJT)";
      if (i != ojt.length - 1) {
        ojt_list = ojt_list + "\n";
      }
    }
    return ojt_list;
  }

  function get_shift_list(shifts) {
    var shift_list = "";
    for (var i = 0; i < shifts.length; i++) {
      shift_list = shift_list + "        " + get_korean_name_rank(shifts[i][0]);
      if (i != shifts.length - 1) {
        shift_list = shift_list + "\n";
      }
    }
    return shift_list;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = moment(new Date(e.target.value)).format("MM-DD");
    setDate(newDate);
  };

  const handleUpload = async () => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });

    var report = getSwings(jsonData);
    setReport(report);
    setShowReport(!showReport);
  };

  return (
    <>
      <div className="input-group">
        <input id="file" type="file" onChange={handleFileChange} />
        <input id="date" type="date" onChange={(e) => handleDateChange(e)} />
      </div>
      {file && (
        <section>
          <ul>{file.name}</ul>
        </section>
      )}

      {file && (
        <button onClick={handleUpload} className="submit">
          Upload File
        </button>
      )}
      {showReport ? <Text>{report}</Text> : null}
    </>
  );
};

export default FileUploader;
