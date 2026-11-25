
import axios from "axios";

const API = axios.create({
    baseURL:import.meta.env.VITE_PRODUCT_API_URL
})

export interface Product{
id: number,
title: string,
price: number,
description: string,
category: string,
image: string,
rating: {
    rate: number;
    count: number;
  };
}


export const getProducts = () =>
    API.get<Product[]>("/products").then((res) => res.data);

export const getCategories = () =>
  API.get<string[]>("/products/categories").then((res) => res.data);

