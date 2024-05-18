const qrcode = require("qrcode-terminal");
const axios = require("axios");
const path = require('path');
const fs = require('fs');
const mime=require('mime');
const { URL } = require('url');


const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const { log } = require("console");
const client = new Client({ authStrategy: new LocalAuth() ,puppeteer:{headless:false}});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});
client.on("disconnected", (reason) => {
  console.error('Client was disconnected:', reason);
});
client.on("auth_failure", (msg) => {
  console.error('Authentication failed:', msg);
});

client.on("message", async (message) => {
  const msg = message.body;
  
  console.log("hello");
  if(message.body === 'Hi'){
    client.sendMessage(message.from,'Hello\nThis is a whatsapp bot\nChoose one\n1)Product advisor\n2)Price comparison\n\nGo to our website: https://react-8b0dd.web.app');
}
else if(message.body === 'Product advisor'){
    client.sendMessage(message.from,'What type of product do you want?\nElectronics\nKitchenware\nClothes');
}
else if (message.body === 'Electronics'){
    client.sendMessage(message.from,'Do you want\nMobile\nMonitor\nWatch');
}
else if (message.body === 'Kitchenware'){
    client.sendMessage(message.from,'Here are some products from our website');
    //Display products image, website link, price
    const mixer =await MessageMedia.fromUrl('https://m.media-amazon.com/images/I/718Bxs69wUL._AC_UY436_FMwebp_QL65_.jpg');
    client.sendMessage(message.from,mixer,{caption: 'Kenwood kMix Stand Mixer for Baking, Stylish Kitchen Mixer with K-beater, Dough Hook and Whisk, 5 Litre Glass Bowl\nRating: 3\nPrice: Rs.5999'});
}
else if (message.body === 'Clothes'){
    client.sendMessage(message.from,'Choose your category\nMen\nWomen\nChildren');
}
else if (message.body === 'Price comparison'){
    client.sendMessage(message.from,'Enter product name');
}
else if (message.body === 'Mobile'){
    client.sendMessage(message.from,'Here are some mobiles');
    //display image description features price
    const mobile = await MessageMedia.fromUrl('https://m.media-amazon.com/images/I/81gC7frRJyL._SX679_.jpg');
    client.sendMessage(message.from,mobile,{caption: 'Apple 2022 11-inch iPad Pro (Wi-Fi, 256GB) - Space Grey (4th Generation)\nRating: 4\nPrice: Rs.84500'});
}
else if (message.body === 'Monitor'){
    client.sendMessage(message.from,'Here are some monitors from our website');
    //display image description features price
    const monitor = await MessageMedia.fromUrl('https://m.media-amazon.com/images/I/51+iB9+5HKL._AC_UY436_FMwebp_QL65_.jpg');
    client.sendMessage(message.from,monitor,{caption: 'Samsung 123.9cm 49inch Gaming Monitor with 32:9 Aspect Ratio Display and 240Hz Refresh Rate - LC49G95TSSWXXL\nRating: 3\nPrice: Rs.13500'});
}
else if (message.body === 'Watch'){
    client.sendMessage(message.from,'Here are some watches from our website');
    //display image description features price
    const watch = await MessageMedia.fromUrl('https://m.media-amazon.com/images/I/61u2Rr7tBRL._UX679_.jpg');
    client.sendMessage(message.from,watch,{caption: 'Fastrack Reflex 3.0 Digital Black Dial Unisex-Adult Watch-SWD90067PP03A\nRating: 2\nPrice: Rs.2999'});
}
else if (message.body === 'Men'){
    client.sendMessage(message.from,'Here are some clothes from mens category');
    //display image description available_size price
}
else if (message.body === 'Women'){
    client.sendMessage(message.from,'Here are some clothes from womens category');
    //display image description available_size price
}
else if (message.body === 'Children'){
    client.sendMessage(message.from,'Here are some clothes from children category');
    //display image description available_size price
}
else {
    const api_key =
      "";//add api key
    const search = msg.replace(/\s+/g, "+");
    const result = await axios(
      `https://serpapi.com/search.json?engine=google_shopping&location=Mumbai,+Maharashtra,+India&gl=in&q=${search}&api_key=${api_key}`
    );
    const top_results = result.data.shopping_results;
    if (top_results) {
      let unique_products = [];
      for (let i = 0; i < top_results.length; i++) {
        if (unique_products.length >= 5) {
          break;
        }
        let product = top_results[i];
        let source = product.source;
        let title = product.title;
        let price = product.price;
        if (
          !unique_products.find((p) => p.title === title && p.source === source)
        ) {
          unique_products.push({ title, source, price });
        }
      }
      //product.price.sort(function(a,b){return a-b});
      let replyMsg = "Here are the top 5 unique products:\n";
      for (let i = 0; i < unique_products.length; i++) {
        let product = unique_products[i];
        replyMsg += `${i + 1}. ${product.title} \n${product.price} \n${
          product.source
        }\n\n`;
      }
      let thumbnail = '';//idhar product thumbnail add kar
      let img =await MessageMedia.fromUrl(thumbnail);
      client.sendMessage(message.from,img,{caption: message.body});
      client.sendMessage(message.from,replyMsg);
    }

      // Review ka dekh lena

      /*
      const url = ``;//idhar api ka url daalna aur search mein reviews add karna aur iske neeche ka code wrong hai
      
        const response = await axios(url);
        const reviews = response.data.organic_results;
        if (reviews) {
          let unique_products = [];
          for (let i = 0; i < reviews.length; i++) {
            if (unique_products.length >= 1) {
              break;
            }
            let product = top_results[i];
            let source = product.source;
            let title = product.title;
            let price = product.price;
            if (
              !unique_products.find((p) => p.title === title && p.source === source)
            ) {
              unique_products.push({ title, source, price });
            }
          }
          let replyMsg = "Here are some reviews:\n";
          for (let i = 0; i < unique_products.length; i++) {
            let product = unique_products[i];
            replyMsg += `${i + 1}. ${product.title} \n${product.price} \n${
              product.source
            }\n\n`;
          }
        }
      */  
  }

});

client.initialize();