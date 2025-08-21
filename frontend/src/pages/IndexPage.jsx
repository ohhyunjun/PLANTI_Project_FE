import React from "react";
import { useNavigate } from "react-router-dom";

function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#047857",
              borderRadius: "50%",
            }}
          ></div>
          <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#064e3b" }}>
            PLANTI
          </span>
        </div>
        <h1>Plant Care Application</h1>
        <p>
          Monitor soil moisture, temperature, and light. Automate watering and
          lighting schedules. Connect your custom device in seconds.
        </p>
        <div className="store-btns">
          <button>Download on the App Store</button>
          <button>Get it on Google Play</button>
        </div>
        <button className="goto-loginchoicepage" onClick={() => navigate("/auth/loginchoice")}>
          로그인 / 회원가입으로 이동
        </button>
      </div>
      <div style={{ textAlign: "center" }}>
        <img
          src="https://via.placeholder.com/150x250?text=Plant+Image"
          alt="Plant"
        />
      </div>
    </div>
  );
}

export default IndexPage;
