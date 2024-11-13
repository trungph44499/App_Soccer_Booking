import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import json_config from "../config.json";
import NavigationPage from "./navigation_page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/css.css";  // CSS tùy chỉnh cho giao diện

export default function StadiumManagement() {
  return (
    <div>
       <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);  // Dữ liệu sân vận động
  const [dataUpdate, setDataUpdate] = useState({});  // Dữ liệu sân cần cập nhật
  const [isUpdate, setIsUpdate] = useState(false);  // Trạng thái xem có đang sửa hay không
  const [isAdd, setIsAdd] = useState(false);  // Trạng thái xem có đang thêm sân mới hay không
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công

  const name = useRef();  // Tham chiếu đến input tên sân
  const address = useRef();  // Tham chiếu đến input địa chỉ
  const type = useRef();  // Tham chiếu đến input loại sân
  const img = useRef();  // Tham chiếu đến input hình ảnh

  
  // Lấy tất cả sân vận động từ API
  async function getAllStadiums() {
    try {
      const { status, data } = await axios.get(`${json_config[0].url_connect}/stadiums`);
      if (status === 200) {
        setData(data);  // Cập nhật lại dữ liệu
      }
    } catch (error) {   
      console.error("Lỗi khi lấy dữ liệu sân:", error);
      setErrorMessage("Lỗi khi lấy dữ liệu sân.");
    }
  }

  useEffect(() => {
    getAllStadiums();  // Lấy dữ liệu khi component load
  }, []);

  // Cập nhật thông tin sân
  const handleUpdate = async () => {
    try {
      const response = await axios.post(`${json_config[0].url_connect}/stadiums/update`, {
        name: name.current.value,
        address: address.current.value,
        type: type.current.value,
        img: img.current.value,
        stadiumId: dataUpdate._id,
      });

      if (response.status === 200) {
        setSuccessMessage("Cập nhật sân thành công!");
        setIsUpdate(false);
        await getAllStadiums(); // Cập nhật lại danh sách sau khi sửa
      } else {
        setErrorMessage(response.data.response || "Lỗi khi cập nhật sân");
      }
    } catch (error) {
      console.error("Error updating stadium:", error);
      setErrorMessage("Lỗi khi cập nhật sân");
    }
  };

  // Thêm sân mới
  const handleAdd = async () => {
    try {
      const response = await axios.post(`${json_config[0].url_connect}/stadiums/register`, {
        name: name.current.value,
        address: address.current.value,
        type: type.current.value,
        img: img.current.value,
      });

      if (response.status === 200) {
        setSuccessMessage("Thêm sân thành công!");
        setIsAdd(false);
        await getAllStadiums(); // Cập nhật lại danh sách sau khi thêm mới
      } else {
        setErrorMessage(response.data.response || "Lỗi khi thêm sân");
      }
    } catch (error) {
      console.error("Error adding stadium:", error);
      setErrorMessage("Lỗi khi thêm sân");
    }
  };

  // Xóa sân
  const handleDelete = async (stadiumId) => {
    const result = window.confirm("Bạn có chắc chắn muốn xóa sân này?");
    if (result) {
      try {
        const response = await axios.post(`${json_config[0].url_connect}/stadiums/delete`, { stadiumId });
        if (response.status === 200) {
          setSuccessMessage("Xóa sân thành công!");
          await getAllStadiums(); // Cập nhật lại danh sách sau khi xóa
        } else {
          setErrorMessage(response.data.response || "Lỗi khi xóa sân");
        }
      } catch (error) {
        console.error("Error deleting stadium:", error);
        setErrorMessage("Lỗi khi xóa sân");
      }
    }
  };

  return (
    <div>
      {/* Thông báo lỗi và thành công */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Form thêm và sửa sân */}
      {isUpdate && (
        <div className={`m-2 ${isUpdate ? "slide-in" : "slide-out"}`}>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Name</span>
            <input ref={name} type="text" defaultValue={dataUpdate.name} />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Address</span>
            <input ref={address} type="text" defaultValue={dataUpdate.address} />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Type</span>
            <input ref={type} type="text" defaultValue={dataUpdate.type} />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Image URL</span>
            <input ref={img} type="text" defaultValue={dataUpdate.img} />
          </div>
          <div className="d-flex flex-row">
            <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
            <div style={{ width: 5 }} />
            <button className="btn btn-secondary" onClick={() => setIsUpdate(false)}>Quit</button>
          </div>
        </div>
      )}

      {/* Form thêm sân mới */}
      {isAdd && (
        <div className={`m-2 ${isAdd ? "slide-in" : "slide-out"}`}>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Name</span>
            <input ref={name} type="text" />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Address</span>
            <input ref={address} type="text" />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Type</span>
            <input ref={type} type="text" />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>Image URL</span>
            <input ref={img} type="text" />
          </div>
          <div className="d-flex flex-row">
            <button className="btn btn-primary" onClick={handleAdd}>Add</button>
            <div style={{ width: 5 }} />
            <button className="btn btn-secondary" onClick={() => setIsAdd(false)}>Quit</button>
          </div>
        </div>
      )}

      {/* Nút thêm sân */}
      <div style={{ position: "fixed", bottom: 50, right: 50 }}>
        <button
          style={{ borderRadius: 30, height: 50, width: 50 }}
          onClick={() => { setIsUpdate(false); setIsAdd(true); }}
        >
          <FontAwesomeIcon icon={faAdd} size="xl" />
        </button>
      </div>

      {/* Bảng hiển thị sân */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Type</th>
            <th scope="col">Image</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.address}</td>
              <td>{item.type}</td>
              <td>
                <img src={item.img} height={50} width={50} alt="stadium" />
              </td>
              <td>
                <button
                  onClick={() => {
                    setIsUpdate(false);
                    setTimeout(() => {
                      setDataUpdate(item);
                      setIsAdd(false);
                      setIsUpdate(true);
                    }, 500);
                  }}
                  className="btn btn-primary"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
