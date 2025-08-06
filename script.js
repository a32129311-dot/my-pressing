let selectedNumber = null;
  let totalPrice = 0;

  const TikitM = [
    { id: 1, name: "سروال", pric: 5 },
    { id: 2, name: "قميجة", pric: 5 },
    { id: 3, name: "جلابة", pric: 6 },
    { id: 4, name: "فيستة", pric: 6 },
    { id: 5, name: "جاكيطة", pric: 6 },
    { id: 6, name: "مونطو", pric: 6 },
    { id: 7, name: "تكشطة", pric: 12 },
    { id: 8, name: "قفطان", pric: 6 },
    { id: 9, name: "شورط", pric: 5 },
    { id: 10, name: "كونبلي", pric: 12 },
    { id: 11, name: "صاية", pric: 5 },
    { id: 12, name: "كسوة بنات طويلة", pric: 6 },
    { id: 13, name: "تريكو", pric: 5 },
    { id: 14, name: "فوطة", pric: 3 },
  ];

  const TikitS = [
    { id: 1, name: "سروال", pric: 10 },
    { id: 2, name: "قميجة", pric: 10 },
    { id: 3, name: "جلابة", pric: 15 },
    { id: 4, name: "فيستة", pric: 17 },
    { id: 5, name: "جاكيطة", pric: 15 },
    { id: 6, name: "مونطو", pric: 20 },
    { id: 7, name: "تكشطة", pric: 30 },
    { id: 8, name: "قفطان", pric: 15 },
    { id: 9, name: "سبرديلة", pric: 20 },
    { id: 10, name: "شورط", pric: 10 },
    { id: 11, name: "كونبلي", pric: 30 },
    { id: 12, name: "صاية", pric: 10 },
    { id: 13, name: "كسوة بنات طويلة", pric: 12 },
    { id: 14, name: "تريكو", pric: 12 },
    { id: 15, name: "مانطا", pric: 35 },
    { id: 16, name: "فوطة", pric: 10 },
    { id: 17, name: "كوفرلي", pric: 35 },
  ];

  let currentList = TikitM;

  const today = new Date();
  const dateString = today.toLocaleDateString('ar-MA');
  document.getElementById("todayDate").textContent = dateString;

  function selectNumber(num) {
    selectedNumber = num;
    document.querySelectorAll('.numbers button').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
  }

  function renderItems(list) {
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";
    list.forEach(item => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `<div class="item-name">${item.name}</div><div class="item-price">${item.pric} DH</div>`;
      div.onclick = () => addClothing(item.name, item.pric);
      container.appendChild(div);
    });
  }

  function showCategory(cat) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    if (cat === 'm') {
      currentList = TikitM;
      renderItems(TikitM);
      document.querySelector(".tab:nth-child(1)").classList.add("active");
    } else {
      currentList = TikitS;
      renderItems(TikitS);
      document.querySelector(".tab:nth-child(2)").classList.add("active");
    }
  }

  function addClothing(item, price) {
    const output = document.getElementById("output");
    let quantity = selectedNumber || 1;
    let lines = output.value.trim().split("\n").filter(line => line.trim() !== "");
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      let parts = lines[i].split(" ");
      let lineQuantity = parseInt(parts[0]);
      let lineItem = parts.slice(1).join(" ").split('----------------->')[0].trim();

      if (lineItem === item) {
        lineQuantity += quantity;
        lines[i] = `${lineQuantity} ${item} ----------------->${price * lineQuantity}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.push(`${quantity} ${item} ----------------->${price * quantity}`);
    }

    output.value = lines.join("\n");
    totalPrice += price * quantity;
    document.getElementById("total").textContent = `المجموع: ${totalPrice} درهم`;
    selectedNumber = null;
    document.querySelectorAll('.numbers button').forEach(btn => btn.classList.remove('selected'));
  }

  function clearAll() {
    document.getElementById("output").value = "";
    document.getElementById("total").textContent = "المجموع: 0 درهم";
    document.getElementById("receiptId").textContent = "----";
    totalPrice = 0;
    selectedNumber = null;
    document.getElementById("whatsappNumber").value = "";
    document.getElementById("nameclione").value = "";
    document.querySelectorAll('.numbers button').forEach(btn => btn.classList.remove('selected'));
  }

  function sendToWhatsapp() {
    const output = document.getElementById("output").value;
    const number = document.getElementById("whatsappNumber").value.trim();
    const name = document.getElementById("nameclione").value.trim();
    const date = document.getElementById("todayDate").textContent;

    if (!number) {
      alert("المرجو إدخال رقم واتساب أولاً.");
      return;
    }

    let lastId = localStorage.getItem('lastReceiptId');
    if (!lastId) lastId = 0;
    let currentId = parseInt(lastId) + 1;
    let formattedId = currentId.toString().padStart(4, '0');
    document.getElementById("receiptId").textContent = formattedId;
    localStorage.setItem('lastReceiptId', currentId);

    const receiptId = formattedId;

    let receiptContent = `🧾 وصل رقم: ${receiptId}\n📅 التاريخ: ${date}\n👤 الاسم: ${name}\n\n${output}\n---------------------\nالمجموع: ${totalPrice} درهم`;
    let receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
    receipts.push({ id: receiptId, date, name, number, content: output, total: totalPrice });
    localStorage.setItem('receipts', JSON.stringify(receipts));

    let message = encodeURIComponent(receiptContent);
    let phone = number;

    if (phone.startsWith("0")) {
      phone = "212" + phone.substring(1);
    } else if (!phone.startsWith("212")) {
      phone = "212" + phone;
    }

    let whatsappURL = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappURL, '_blank');
  }

 function showReceipts() {
  window.location.href = 'receipts.html';
}

renderItems(TikitM);