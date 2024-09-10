import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [productCountsByCategory, setProductCountsByCategory] = useState([]);
  const [averagePricesByCategory, setAveragePricesByCategory] = useState([]);

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        processProductData(response.data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const processProductData = (data) => {
    const categorySet = new Set(data.map((product) => product.category));
    const categories = Array.from(categorySet);

    const productCounts = categories.map(
      (category) =>
        data.filter((product) => product.category === category).length
    );

    const averagePrices = categories.map((category) => {
      const categoryProducts = data.filter(
        (product) => product.category === category
      );
      const totalPrices = categoryProducts.reduce(
        (acc, product) => acc + product.price,
        0
      );
      return (totalPrices / categoryProducts.length).toFixed(2);
    });

    setCategories(categories);
    setProductCountsByCategory(productCounts);
    setAveragePricesByCategory(averagePrices);
  };

  const productCountData = {
    labels: categories,
    datasets: [
      {
        label: "Total Products by Category",
        data: productCountsByCategory,
      },
    ],
  };

  const averagePriceData = {
    labels: categories,
    datasets: [
      {
        label: "Average Price by Category",
        data: averagePricesByCategory,
      },
    ],
  };

  return (
    <div
      className="dashboard"
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h2>E-commerce Product Dashboard</h2>
      <div className="chart-container">
        <div style={{ width: "600px", margin: "20px" }}>
          <Bar data={productCountData} options={{ responsive: true }} />
        </div>
        <div style={{ width: "600px", margin: "20px" }}>
          <Bar data={averagePriceData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
