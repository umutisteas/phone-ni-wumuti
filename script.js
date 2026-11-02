document.getElementById('actionBtn').addEventListener('click', function() {
    const status = document.getElementById('statusTxt');
    status.textContent = "Status: 🎉 Button Tapped Successfully!";
    status.style.color = "#16a34a";
    status.style.fontWeight = "bold";
});
