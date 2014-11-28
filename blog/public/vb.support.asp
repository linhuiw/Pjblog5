<script runat="SERVER" language="VBSCRIPT">
Function VB_AscB( s )
	VB_AscB = AscB( s )
End Function

Dim VB_BNCRLF : VB_BNCRLF = ChrB(13) & ChrB(10)
Dim VB_DOUBLEBNCRLF : VB_DOUBLEBNCRLF = VB_BNCRLF & VB_BNCRLF

Function VB_DRIVER( formData )
	VB_DRIVER = LeftB( formData, CInt( InstrB( formData, VB_BNCRLF ) ) - 1 )
End Function

Function VB_INSERTB( formdata, divider )
	VB_INSERTB = InstrB( formdata, divider )
End Function

Function VB_INSERTBS( startpos, formdata, divider )
	VB_INSERTBS = InstrB( startpos, formdata, divider )
End Function

Function VB_LENB( divider )
	VB_LENB = LenB( divider )
End Function

Function VB_MIDBS( a, b, c )
	VB_MIDBS = MidB( a, b, c )
End Function

Function VB_MIDB( a, b )
	VB_MIDB = MidB( a, b )
End Function
</script>