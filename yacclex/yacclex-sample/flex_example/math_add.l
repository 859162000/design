%{
int sum = 0;
%}
%%
[0-9]+	{ sum++; }
%%

int main(){
	yylex();
	printf("number count = %8d\n", sum);
	return 0;
}