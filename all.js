// variable declaration
let NewDataArray = [];
const xhr = new XMLHttpRequest();
const cards = document.querySelector('#card-group');
const paginationArea = document.querySelector('#pagination');
const btns = document.querySelector('#popularList');
const selectDistrict = document.querySelector('#district');


/*convert Data from JSON to Array*/
function convertData(string) {
    return JSON.parse(string);
}

/*save all Data at local*/
function saveToLocal(rawDataArray) {
    for (let i = 0; i < rawDataArray.result.records.length; i++) {
        if (rawDataArray.result.records[i].Ticketinfo === "") {
            rawDataArray.result.records[i].Ticketinfo = '暫無資料';
        }

        let obj = {
            title: rawDataArray.result.records[i].Name,
            opentime: rawDataArray.result.records[i].Opentime,
            address: rawDataArray.result.records[i].Add,
            district: rawDataArray.result.records[i].Zone,
            tel: rawDataArray.result.records[i].Tel,
            ticket: rawDataArray.result.records[i].Ticketinfo,
            pic: rawDataArray.result.records[i].Picture1,
        };
        NewDataArray.push(obj);
    }
}

/*Default and All cards*/
function showAllCards(){
    document.querySelector('#districtTitle').innerHTML = '所有景點';
    concatenation(NewDataArray);
}

/*show only selected data*/
function filterByDistrict(e){
    let districtName = e.target.value;
    if(districtName === undefined || districtName === 0){return;}
    document.querySelector('#districtTitle').innerHTML = districtName;
    let filteredArray = NewDataArray.filter((name) =>name.district === districtName);
    if(filteredArray.length === 0){cards.innerHTML = "暫無紀錄";}
    concatenation(filteredArray);
    paginationArea.style.display = "none";
}

/*String: purpose of DRY*/
function concatenation(array){
    let string = '';
    for (let i = 0; i < array.length; i++) {
        let content = `
            <div class="card text-left px-0 mb-3">
                <div class="card-title d-flex justify-content-between align-items-end text-white mb-0" style="background: url(${array[i].pic}) bottom center no-repeat; background-size: cover">
                    <h2 class="pl-2">${array[i].title}</h2>
                    <p class="pr-2 mb-2">${array[i].district}</p>
                </div>
                <div class="card-body px-2 py-3">
                    <ul class="list-unstyled mb-0">
                        <li class="mb-2"><i class="text-purple far fa-clock mr-2"></i>${array[i].opentime}</li>
                        <li class="pl-1 mb-2"><i class="text-orange fas fa-map-marker-alt mr-2"></i>${array[i].address}</li>
                        <li class="d-flex justify-content-between pl-1 mb-2">
                            <span class=""><i class="text-blue fas fa-mobile-alt mr-3"></i>${array[i].tel}</span>
                            <span class=""><i class="text-yellow fas fa-tag mr-2"></i>${array[i].ticket}</span>
                        </li>
                    </ul>
                </div>
            </div>
            `;
        string += content;
        cards.innerHTML = string;
    }
}

/*set district options*/
function setSelect(){
    let districtCacheArray = [];
    let districtResultArray;
    let string = '';
    const districtSelect = document.querySelector('#district');

    NewDataArray.forEach((item)=>districtCacheArray.push(item.district));
    districtResultArray = Array.from(new Set(districtCacheArray));
    for (let i = 0; i < districtResultArray.length; i++) {
        let content = `
            <option value="${districtResultArray[i]}">${districtResultArray[i]}</option>
            `;
        string += content;
        districtSelect.innerHTML = '<option value="所有景點" selected disabled>--選擇行政區--</option>' +string;
    }
}




xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send();
xhr.onload = function () {
    let rawDataArray = convertData(xhr.responseText);

    saveToLocal(rawDataArray);

    setSelect();

    showAllCards();
}
btns.addEventListener('click', filterByDistrict, false);
selectDistrict.addEventListener('change',filterByDistrict,false);
window.addEventListener('scroll',function(){
    if(this.scrollY < 600){
        $('#goTop').hide();
    }
    else {
        $('#goTop').show();
    }
})
