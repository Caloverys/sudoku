	const table_container = document.querySelector("#table_container");
	let key_array;
	let current_array;

	for(let i = 0; i<9;i++){
		let table = document.createElement("table");
		table.className = `table_${i}`
		for(let j=0; j<3;j++){
			let tr = document.createElement("tr");
			tr.className = `tr_${j}`
			for(let b = 0; b<3;b++){
				let td = document.createElement("td");
				td.className = `td_${b}`
				tr.appendChild(td);
			}
			table.appendChild(tr)
		}
		table_container.appendChild(table);
	}
	const num_list =[1,2,3,4,5,6,7,8,9];
	function random_assign(arr){
		const new_arr = [];
		// can not directly modify arr because if will modify the original array (num_list)
		const duplicate_arr =JSON.parse(JSON.stringify(arr));
		while(duplicate_arr.length > 0){
			let random_num = Math.floor(Math.random() *  duplicate_arr.length)
			new_arr.push(duplicate_arr[random_num]);
			 duplicate_arr.splice(random_num,1);

		}
		return new_arr;

	}
	function generate_numbers(){
		const array = []; 
		for(let i =0; i < 9;i++){
			//create a 3 * 3 block
				const block = Array.from(Array(3), () => new Array(3));;

				const hor_restricted_row = [...Array(3)].map(e => Array());

				//Math.floor(i/3) * 3 => 0th or 3rd or 6th block
				for(let j=Math.floor(i/3) * 3; j<i;j++){
					for(let x=0;x<3;x++) {
						for(let y =0; y<3;y++) hor_restricted_row[x].push(array[j][x][y]);
					}

				}
			const ver_restricted_row = [...Array(3)].map(e => Array());
			//i%3 => 0th or 1st or 2nd block
			for(let j = i%3; j<i;j+=3) {
				for(let k =0;k<3;k++){
						for(let x =0; x< 3;x++) ver_restricted_row[k].push(array[j][x][k])
					}

			}
			for(let j =0; j<3;j++){
				for(let x = 0;x<3;x++){
					//convert 2d array block to be 1d so that it could be searched (.includes) below. block.slice() create a copy of the original array
					const flat_block = [].concat.apply([],block.slice());

				    
					if(hor_restricted_row[0]!== undefined  && ver_restricted_row[0]!== undefined) 
						block[j][x] = random_assign(num_list.filter(i=>!hor_restricted_row[j].includes(i) && !ver_restricted_row[x].includes(i) && !flat_block.includes(i)))[0];

					else if(hor_restricted_row[0] !== undefined)
						block[j][x] =random_assign(num_list.filter(i=>!hor_restricted_row[j].includes(i) && !flat_block.includes(i)))[0];

					else if(ver_restricted_row[0]!== undefined)
						block[j][x] =random_assign(num_list.filter(i=>!flat_block.includes(i) && !ver_restricted_row[x].includes(i)))[0];

					else block[j][x] =random_assign(num_list.filter(i=>!flat_block.includes(i)))[0];
					
				}
			}
			if([].concat.apply([],block.slice()).includes(undefined)) {
				generate_numbers();
				return;
			}
			array.push(block);
	}
		

key_array = array.slice();

	}

	
	document.querySelectorAll("td").forEach(td=>{

		td.addEventListener("click", function(){
			remove_class(["selected","selected_column_color"]);
			if(td.textContent === ""){
				td.classList.add("selected")
				td.parentNode.classList.add('selected_column_color');
				//get the number from the string (className)
				const table_num = parseInt(td.parentNode.parentNode.className.replace(/[^0-9]/g, ''));
				const tr_num = parseInt(td.parentNode.className.replace(/[^0-9]/g, ''));
				const td_num = parseInt(td.className.replace(/[^0-9]/g, ''))
				for(let i = Math.floor(table_num/3)*3;i< Math.floor(table_num/3)*3 + 3;i++){
					document.querySelectorAll("table")[i].querySelectorAll("tr")[tr_num].classList.add("selected_column_color")
				}
				for(let i =table_num%3;i<9;i+=3){
					document.querySelectorAll("table")[i].querySelectorAll("tr").forEach(tr=>{
						console.log(tr, td_num)
						tr.querySelectorAll('td')[td_num].classList.add("selected_column_color")

					})
				}
				return;
			}
			[...document.querySelectorAll("td")].filter(ele=>ele.textContent === td.textContent).forEach(i=> i.classList.add("selected"));

		})
	})

	generate_numbers();



function remove_class(class_name){
	if(Array.isArray(class_name)){
		class_name.forEach(name=>{
			document.querySelectorAll(`.${name}`).forEach(ele=>ele.classList.remove(name))
		})
		return;
	} 
	document.querySelectorAll(`.${class_name}`).forEach(ele=>ele.classList.remove(class_name))

}
function display(array){
	document.querySelectorAll("table").forEach((table,num_1)=>{
			table.querySelectorAll("tr").forEach((tr,num_2)=>{
				tr.querySelectorAll("td").forEach((td,num_3)=>{
					
					td.textContent = array[num_1][num_2][num_3];

				})

			})
		})
	
}
//display(key_array);

function simple_game(){
	const game_array = JSON.parse(JSON.stringify(key_array));
	game_array.forEach(arr=>{
		const random_num = Math.random();
		let block_num_removed;
		if(random_num <=0.05){
			block_num_removed = 1;
		}else if(random_num <= 0.1){
			block_num_removed = 2;
		}else if(random_num <= 0.5){
			block_num_removed = 3
		}else if(random_num <=0.75){
			block_num_removed = 4;
		}else if(random_num <=1){
			block_num_removed = 5;
		}
		//get the randomed array for the index of numbers to be removed
		let random_arr = random_assign(num_list);
		for(let i =0; i< block_num_removed;i++){
			//the random_arr is in range of 1-9, but index range is from 0-8
			arr[Math.floor((random_arr[i]-1)/3)][(random_arr[i]-1)%3] = undefined;

		}
	})
	current_array = game_array;
}
simple_game();
display(current_array);

document.addEventListener("keypress",event=>{
	if(document.querySelector(".selected").textContent === "" && num_list.includes(parseInt(event.key))){
		document.querySelector(".selected").textContent = event.key;
		document.querySelector(".selected").classList.add("selected_transition");
		remove_class("selected_column_color")

	}
})





