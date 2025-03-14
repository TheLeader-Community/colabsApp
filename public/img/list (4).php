<?php
  ini_set('display_errors',1);

$currentyear = date('Y');
$nextyear =  date('Y') + 1;
$sy = intval($currentyear .'-'.$nextyear);
$num_recu=rand(100000,999999);
$next_next=$nextyear+1;
$n_anner=$nextyear.'-'.$next_next;

$user_type=''; 

     
$stmt_cla =$connect->prepare("select * from  class   WHERE  ecole_id='".$_SESSION['ecole_id']."' 
    ") ; 
  
  $stmt_cla->execute();  $resu_cla = $stmt_cla->fetchAll();   
  $tot_jour=0;	  $tot_mens=0;$tot=	0;	
  $tot_jour_m=0;$tot_m=0; $reste=0;

    $moti_pa="";     
    
    
       function nombreEnLettres($nombre) {
        $numberFormatter = new NumberFormatter('fr', NumberFormatter::SPELLOUT);
        return $numberFormatter->format($nombre);
    }
 ?>
 
 <style>
        .input-group-addon {
            background-color: #29323c; color:white;
         }

        .input-group-addon i {
            margin-right: 5px;
        }

         
    </style>
 
 
    <div class="row" style="text-align:center"> <div class="col-lg-12">
             <h2 class="page-header">  	 Suivi quotidien des <br>transactions financières<br><br>
 
		</h2>
        </div> </div>

 <div class="row">
 <div class="col-lg-12">
       <div class="col-md-2"></div>

       <div class="col-lg-8">   
       
        <form action="" method="POST" > 
        
         <div class="form-group col-sm-5">
        <div class="input-group">
            <span class="input-group-addon">
                <i class="fa fa-calendar-alt"></i>
            </span>
 		<input class="form-control" type="text"  name="ladate" id="ladate" placeholder="Veuillez choisir une date" autocomplete="off"  required>
        </div>
    </div>
        
         <div class="form-group col-sm-5">
        <div class="input-group">
            <span class="input-group-addon">
                <i class="fa fa-list-alt"></i>
            </span>
 	     <select  class="form-control" name="filtrage">
 	      <option value="tous">Tous</option> 
        <option value="autre_mois">Caisse Normal </option> 
        <option value="juin">Caisse Particulière (Mois de Juin)</option> 
        <option value="moti_frai_sco">Frais Scolaires</option> 
        <option value="moti_enro">Frais d'enrolement</option>
        <option value="moti_avance">Avance de frais scolaire</option> 
        <option value="moti_reglement_dette">Règlement de dette pour les frais scolaires</option>
 
 	     </select>
        </div>
      </div>
 	  
 	   <div class="form-group col-sm-2"> 
 	   <button type="submit" name="valider" class="btn btn-success "><i class="fa  fa-check-circle"></i> Valider</button>
	 </div> 
	
     </form>	</div>
  </div>   </div>  

 
	    

	 <?php  
$ladate='';
 if(isset($_POST['valider'])){
     
    $ladate = $_POST['ladate'];
      
if ($_POST['filtrage'] == 'tous') {
    include('filtrage/tous.php');
} else if ($_POST['filtrage'] == 'moti_enro') {
    include('filtrage/moti_enro.php');
} else if ($_POST['filtrage'] == 'moti_frai_sco') {
    include('filtrage/moti_frai_sco.php');
} else if ($_POST['filtrage'] == 'autre_mois') {
    include('filtrage/caisse_normale.php');
} else if ($_POST['filtrage'] == 'juin') {
    include('filtrage/caisse_particuliere.php');
} else if ($_POST['filtrage'] == 'moti_avance') {
    include('filtrage/moti_avance.php');
} else if ($_POST['filtrage'] == 'moti_reglement_dette') {
    include('filtrage/moti_reglement_dette.php');
}  


  $stmt_c=$connect->prepare($q_c); 

 if ($stmt_c) {
    $stmt_c->execute(); $resu_c= $stmt_c->fetchAll(); $count= $stmt_c->rowCount();
    // Close the PDO connection
    $stmt_c->closeCursor();  // This is essential for some database systems, not needed for MySQL
    $connect = null;        // Close the connection


$userProvidedDate = $_POST['ladate'];
$dateObject = DateTime::createFromFormat('Y-m-d', $userProvidedDate);

// Check if the date is valid
if ($dateObject !== false) {
    // Set the locale to French using IntlDateFormatter
    $formatter = new IntlDateFormatter(
        'fr_FR',
        IntlDateFormatter::LONG,
        IntlDateFormatter::NONE
    );
    $formattedDate = $formatter->format($dateObject);
} else {
    $formattedDate = $_POST['ladate'];
}
 ?>
 
    <div class="row"> 
     <div class="col-md-3"></div>
    <div class="col-md-5">
 	 <table  class="table table-striped   table-hover "   style="background:white;color:#3c763d;padding:5px;background-color:#dff0d8;  border-color: #d6e9c6;text-align:center;"cellspacing="0">				
         <tr> <th> Date choisie : <?=ucwords($formattedDate)?></th> </tr> 
           <tr> <th>Total nombre de transaction : <?=$count?></th> </tr> 

           <tr> <th>  
           <a href="z_prin_resu_b.php?ladate=<?=$_POST['ladate']?>&filtrage=<?=$_POST['filtrage']?>"  target="_blank" class="btn btn-success btn-sm  "> 	<i class="fa fa-print fw-fa"></i> Imprimer</a>

           </th> </tr> 

      </table> </div> </div>
 
 <div class="row">
 <div class="col-md-5">
   <input class="form-control" type="text" id="myInput" onkeyup="myFunction()" placeholder="Rechercher le parent en saisissant son nom...">
 </div> </div>
 
 
  <div class="table-responsive">
 	 <table id="dash-table" class="table table-striped   table-hover "   style="background:white"cellspacing="0">				
				<thead>
			 
			  <tr  style="background:#29323c ;color:#fff;padding:2px 5px  2px  5px !important"  >
					<th>Info</th>
					<th>Parent</th>
  					    <th>Matricule</th>
						<th>Nom et prénom </th>
						 <th>Mois payé</th>
						<th>Montant payé </th>
						 <th>Reste</th>
 						<th>Motif de paiement </th>
						<th>Classe/Niveau </th>
					</tr>	
				</thead>     

				<tbody>
                  <?php $remise=0;$propo=0;$tot_remise=0;$mont_pa=0;$sum_sup=0;$tot_pa=0;$tot_montant_cla=0;$mont_reste=0;
                  
                  
					  
					  

					  foreach ($resu_c as $row) { 
					        $tot_montant_cla= $row['t.tot_montant_cla']; 
        					
        					if($row['t.nbre_enfant']=='0'){$row['t.nbre_enfant']=1;}
 
                       
                       if($row['t.tut_reduction']>$tot_montant_cla){
                          //  $mont_pa=$row['Montant payé']+(($row['t.tut_reduction']-$tot_montant_cla)/$row['t.nbre_enfant']) ;
                         $mont_pa= (($row['t.tut_reduction']/$tot_montant_cla))*$row['Montant payé'];

                        } 
                        elseif($row['t.tut_montant']==$tot_montant_cla AND $row['t.tut_reduction']!='0'){
                            // $mont_pa=$row['Montant payé']-(($tot_montant_cla-$row['t.tut_reduction'])/$row['t.nbre_enfant'])  ;
                          $mont_pa= (($row['t.tut_reduction']/$tot_montant_cla))*$row['Montant payé'];

 
                        }
                       else {
                           
                        
					      if($row['t.tut_reduction']!='0' AND $row['t.tut_montant']!='0'  ){
					      $mont_pa= (($row['t.tut_reduction']/$tot_montant_cla))*$row['Montant payé'];
                        }
                          
					      elseif($row['t.tut_reduction']=='0' AND $row['t.tut_montant']!='0'   ){
                         $mont_pa= (($row['t.tut_montant']/$tot_montant_cla))*$row['Montant payé'];
                     
                        }
                         
                        
                        elseif($row['t.tut_reduction']=='0' AND $row['t.tut_montant']=='0'  ){
                            $mont_pa=$row['Montant payé'];
                        } 
                       
                      } 

					      
                        if( $row['Motif paiement']=='avance_de_frais_scolaires'){ $moti_pa='Avance de frais scolaire';  }
                        elseif( $row['Motif paiement']=='reglement_de_dette'){ $moti_pa='Règlement de dette pour les frais scolaires';  }
                        elseif( $row['Motif paiement']=='frais_scolaires'){ $moti_pa='Les frais scolaires';  }
                        elseif( $row['Motif paiement']=='Frais d\'inscription/réinscription'){ $moti_pa='Frais d\'inscription/réinscription';  }
                        
                             // calcul du reste individuel
                        if($row['t.tut_reste']!='0' AND $tot_montant_cla!='0'   ){
                         $mont_reste= (($row['t.tut_reste']/$tot_montant_cla))*$row['Montant payé']; 
                        }
                        
                        elseif($row['t.tut_reste']=='0'    ){   $mont_reste=$row['t.reste'];  }
                     
                          
                          
                        
                        echo '<tr>';	
                        echo' <td> <button type="button" id="info_eleve" data-fullname="'.$row['Nom(s) et prénom(s)'].'" data-PAYMENTID="'.$row["t.PAYMENTID"].'" data-IDNO="'.$row["Matricule"].'"  
                        data-ladate_b="'.$_POST["ladate"].'"    data-mois="'.$row["Mois payé"].'"  data-tut_redu="'.$row["t.tut_reduction"].'"  
                        data-tut_mont="'.$row["t.tut_montant"].'"  data-tut_reste="'.$row["t.tut_reste"].'"
                        class="btn btn-primary btn-sm info_ens"     onclick="showInfoBlock(this)" >
                        
                        <i class="fas  fa-info"></i> </button></td>';
                        echo '<td >' .$row['tuteur'].'  </td>'; 
                        echo '<td >' .$row['Matricule'].'  </td>'; 
                        echo '<td >'.$row['Nom(s) et prénom(s)'].'</td>';  
                        echo '<td>'.ucwords($row['Mois payé']).'</td>';
                        echo '<td  style="color:#3c763d;background-color:#dff0d8;  border-color: #d6e9c6;font-weight:bold">'.round($mont_pa).'  </td>'; 
                        echo '<td >'.round($mont_reste).' </td>';  
                        echo '<td>'. $moti_pa.'</td>';
                        echo '<td>'. $row['Classe/Niveau'].'</td>';
                        $tot_pa+=($mont_pa); 
                        echo '</tr>';
					  }
					  
				echo'
				<br><div  style="color:#3c763d;padding:5px;background-color:#dff0d8;  border-color: #d6e9c6;text-align:center;">
				Total <sub> Montant Payé</sub> = <b>'.round($tot_pa).'</b> ('.nombreEnLettres(round($tot_pa)).' ) FCFA </div>  

				</tbody></table>  </div> ';
		 	 

	   } } 
	   
	  
 
	   ?>

 
 
   <style>
    #info_block {
            display: none;
            position: fixed;
            top: 40%;
            left: 40%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
           
        }
        
        #redu{
     background: white;
    color: #3c763d;
    padding: 5px;
    background-color: #dff0d8;
    border-color: #d6e9c6;
    text-align: center;
        }
           #reste{
         background-color: #f8d7da;
    border-color: #d43f3a;
    color: #964739;
    padding: 5px;
  
    text-align: center;
        }
         
        
    </style>
    
    

<div id="info_block" style="display: none;">

<div id="info_content"></div>
<button type="button" id="closeInfoBlock" class="btn btn-danger" onclick="closeInfoBlock()"> Fermer</button>

</div>
   
			
  <!--script src="../../../js/eruda.min.js"> </script>
	<script>eruda.init()</script-->	
	
	<script>       
	    $(document).ready(()=>{
    
    $('#ladate').datepicker({
    format:'yyyy-mm-dd',
    autoclose:true,
    container: '#formModal ',
    language:'fr'
    });



 window.showInfoBlock =function(button){  

     var block = document.getElementById('info_block'); 
     var info_content = document.getElementById('info_content');

    if (info_content) {
        var fullname = button.getAttribute('data-fullname');
        var PAYMENTID = button.getAttribute('data-PAYMENTID');
        var IDNO = button.getAttribute('data-IDNO');
        var ladate_b = button.getAttribute('data-ladate_b');
        var mois = button.getAttribute('data-mois');
        var tut_mont = button.getAttribute('data-tut_mont');
        var tut_redu = button.getAttribute('data-tut_redu');
         var tut_reste = button.getAttribute('data-tut_reste');
         
         if(tut_redu==tut_mont){   tut_redu=0  }

        // Customize the content of the info block using the data attributes
        info_content.innerHTML = `
      
       <p>Montant que le parent à payer</p>
            <p id="redu"><b>${tut_mont}</b></p>
            
             <p>Reduction</p>
            <p id="redu"><b>${tut_redu}</b></p>
            
             <p>Montant restant que le parent doit payer</p>
            <p id="reste"><b>${tut_reste}</b></p>
           
             <p>Nom et prénom  de l'élève : <b>${fullname}</b></p>
          `;

        block.style.display = 'block';
    }
}

window.closeInfoBlock=()=> {
        var infoBlock = document.getElementById('info_block');
        if (infoBlock) {
            infoBlock.style.display = 'none';
        }
    }

    
 
  
      
      $('#formModal_eleve').on('click', function (e) {
    if (e.target === this) {
      // If the click occurred on the modal background, close the modal
      $(this).modal('hide');
    }
  }); 
  
      $('#btn_clo').on('click', function (e) {
    
           $('#formModal_eleve').modal('hide');
    
  }); 
  
  
  window.myFunction=()=> {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("dash-table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
  
   

 })
 
 
	</script>		
			 
			 
 
 