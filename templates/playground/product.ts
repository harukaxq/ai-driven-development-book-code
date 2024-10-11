const products = [
    { id: 1, name: "商品A", price: 1000, stock: 10 },
    { id: 2, name: "商品B", price: 2000, stock: 20 },
    { id: 3, name: "商品C", price: 3000, stock: 30 },
    { id: 4, name: "商品D", price: 4000, stock: 40 },
    { id: 5, name: "商品E", price: 5000, stock: 50 },
];

export function getNameById(id: number) {
    const product = products.find(product => product.id === id);
    return product ? product.name : null;
}


const id = 3;
const productName = getNameById(id);
console.log(`IDが${id}の商品の名前は${productName}です。`);

