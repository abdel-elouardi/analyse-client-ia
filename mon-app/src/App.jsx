import { useState } from "react"

function App() {
  const [numOrders, setNumOrders] = useState("")
  const [income, setIncome] = useState("")
  const [avgGap, setAvgGap] = useState("")
  const [resultat, setResultat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [historique, setHistorique] = useState([])

  const handlePredict = async () => {
    setLoading(true)
    const res = await fetch("https://analyse-client-ia-production.up.railway.app/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        num_orders: parseFloat(numOrders),
        income: parseFloat(income),
        avg_order_gap_days: parseFloat(avgGap)
      })
    })
    const data = await res.json()
    setResultat(data)
    setHistorique(prev => [{
      num_orders: numOrders,
      income: income,
      avg_gap: avgGap,
      ...data,
      date: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 5))
    setLoading(false)
  }

  const getRecommendation = (resultat) => {
    if (!resultat) return null
    if (resultat.churn === 1 && resultat.churn_probabilite > 80) {
      return { text: "Appeler ce client en urgence et offrir une promotion exclusive", color: "#993C1D", bg: "#FAECE7" }
    } else if (resultat.churn === 1) {
      return { text: "Envoyer un email de fidélisation avec une offre spéciale", color: "#854F0B", bg: "#FAEEDA" }
    } else if (resultat.segment === "⭐ Client Premium") {
      return { text: "Proposer un programme VIP et des avantages exclusifs", color: "#0C447C", bg: "#E6F1FB" }
    } else if (resultat.segment === "🟢 Client Fidèle") {
      return { text: "Maintenir la relation et proposer des nouveautés", color: "#3B6D11", bg: "#EAF3DE" }
    } else {
      return { text: "Envoyer une newsletter pour stimuler l'engagement", color: "#534AB7", bg: "#EEEDFE" }
    }
  }

  const RobotIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="6" y="10" width="20" height="14" rx="3" fill="#534AB7"/>
      <rect x="12" y="6" width="8" height="5" rx="2" fill="#7F77DD"/>
      <circle cx="11" cy="17" r="2.5" fill="white"/>
      <circle cx="21" cy="17" r="2.5" fill="white"/>
      <circle cx="11" cy="17" r="1" fill="#534AB7"/>
      <circle cx="21" cy="17" r="1" fill="#534AB7"/>
      <rect x="13" y="21" width="6" height="1.5" rx="0.75" fill="white"/>
      <rect x="10" y="24" width="2" height="3" rx="1" fill="#534AB7"/>
      <rect x="20" y="24" width="2" height="3" rx="1" fill="#534AB7"/>
      <rect x="3" y="14" width="3" height="6" rx="1.5" fill="#7F77DD"/>
      <rect x="26" y="14" width="3" height="6" rx="1.5" fill="#7F77DD"/>
    </svg>
  )

  const fields = [
    { label: "Nombre de commandes", value: numOrders, setter: setNumOrders, placeholder: "Ex: 5" },
    { label: "Revenu (€)", value: income, setter: setIncome, placeholder: "Ex: 2000" },
    { label: "Jours entre commandes", value: avgGap, setter: setAvgGap, placeholder: "Ex: 80" }
  ]

  const isChurn = resultat?.churn === 1
  const recommendation = getRecommendation(resultat)

  return (
    <div style={{
      minHeight: "100vh",
      background: "#EEEDFE",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Card principale */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          border: "0.5px solid #AFA9EC",
          padding: "2.5rem",
          marginBottom: "1rem"
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: "64px", height: "64px", margin: "0 auto 1rem",
              background: "#EEEDFE", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <RobotIcon />
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: "500", color: "#26215C", margin: "0 0 4px" }}>
              Analyse Client IA
            </h1>
            <p style={{ fontSize: "13px", color: "#534AB7", margin: 0 }}>
              Segmentation & détection de churn
            </p>
          </div>

          {/* Champs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "1.5rem" }}>
            {fields.map((field, i) => (
              <div key={i}>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#3C3489", display: "block", marginBottom: "6px" }}>
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: "8px",
                    border: "1px solid #AFA9EC", fontSize: "14px", outline: "none",
                    boxSizing: "border-box", color: "#26215C"
                  }}
                />
              </div>
            ))}
          </div>

          {/* Bouton */}
          <button
            onClick={handlePredict}
            disabled={loading}
            style={{
              width: "100%", padding: "12px",
              background: loading ? "#AFA9EC" : "#534AB7",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "14px", fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Analyse en cours..." : "Analyser le client"}
          </button>

          {/* Résultat */}
          {resultat && (
            <div style={{ marginTop: "1.5rem" }}>

              {/* Cards résultat */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1rem" }}>
                {[
                  { label: "Segment", value: resultat.segment },
                  { label: "Statut", value: isChurn ? "A risque" : "Stable", color: isChurn ? "#993C1D" : "#3B6D11" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#EEEDFE", borderRadius: "8px",
                    padding: "10px", border: "0.5px solid #AFA9EC"
                  }}>
                    <p style={{ fontSize: "11px", color: "#534AB7", margin: "0 0 4px" }}>{item.label}</p>
                    <p style={{ fontSize: "13px", fontWeight: "500", color: item.color || "#26215C", margin: 0 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Barre de risque */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#534AB7", fontWeight: "500" }}>
                    Risque de churn
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: isChurn ? "#993C1D" : "#3B6D11" }}>
                    {resultat.churn_probabilite}%
                  </span>
                </div>
                <div style={{ background: "#EEEDFE", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${resultat.churn_probabilite}%`,
                    background: resultat.churn_probabilite > 70
                      ? "#D85A30"
                      : resultat.churn_probabilite > 40
                      ? "#EF9F27"
                      : "#1D9E75",
                    borderRadius: "99px",
                    transition: "width 0.5s ease"
                  }} />
                </div>
              </div>

              {/* Recommandation */}
              {recommendation && (
                <div style={{
                  padding: "12px", borderRadius: "8px",
                  background: recommendation.bg,
                  border: `0.5px solid ${recommendation.color}22`
                }}>
                  <p style={{ fontSize: "11px", fontWeight: "500", color: recommendation.color, margin: "0 0 4px" }}>
                    Recommandation
                  </p>
                  <p style={{ fontSize: "13px", color: recommendation.color, margin: 0 }}>
                    {recommendation.text}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Historique */}
        {historique.length > 0 && (
          <div style={{
            background: "white", borderRadius: "20px",
            border: "0.5px solid #AFA9EC", padding: "1.5rem"
          }}>
            <p style={{ fontSize: "13px", fontWeight: "500", color: "#3C3489", margin: "0 0 12px" }}>
              Historique des analyses
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {historique.map((h, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px", background: "#EEEDFE", borderRadius: "8px",
                  border: "0.5px solid #AFA9EC"
                }}>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: "500", color: "#26215C", margin: "0 0 2px" }}>
                      {h.segment}
                    </p>
                    <p style={{ fontSize: "11px", color: "#534AB7", margin: 0 }}>
                      {h.num_orders} cmd · {h.income}€ · {h.avg_gap}j
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{
                      fontSize: "12px", fontWeight: "500", margin: "0 0 2px",
                      color: h.churn === 1 ? "#993C1D" : "#3B6D11"
                    }}>
                      {h.churn_probabilite}%
                    </p>
                    <p style={{ fontSize: "10px", color: "#7F77DD", margin: 0 }}>{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App