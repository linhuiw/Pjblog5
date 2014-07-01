function GetCrc32(Path){
	/*shmshz*/
	var Crc32Table=new Array(256),
		i,
		j,
		Crc;
		
	for(i = 0; i < 256; i++){
		Crc=i;
		for(j=0; j<8; j++){
			if(Crc & 1){
				Crc=((Crc >> 1)& 0x7FFFFFFF) ^ 0xEDB88320;
			}else{
				Crc=((Crc >> 1)& 0x7FFFFFFF);
			}
		}
		Crc32Table[i]=Crc;
	};
	
	Crc=0xFFFFFFFF;
	var objAdo=new ActiveXObject("adodb.stream");
    objAdo.Open;
    objAdo.Type = 1;
    objAdo.LoadFromFile(Path);
	for (var i=0;i<objAdo.Size;i++){
		objAdo.Position=i;
		Crc=((Crc >> 8)&0x00FFFFFF) ^ Crc32Table[(Crc & 0xFF)^ VB_AscB(objAdo.Read(1))];/*Crc ^=0xFFFFFFFF;*/
	}
	objAdo.Close;
	objAdo=null;
	if (Crc<0){
		Crc=-Number(Crc)-1;
	}
	else{
		Crc=4294967296-Crc-1;
	}
	return Crc.toString(16).toUpperCase();
}

exports.make = GetCrc32;
