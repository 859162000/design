/* ¼ÆËãÆ÷ me °æ */
%{
#include <stdio.h>
enum yytokentype {
		NUMBER = 258,
		ADD = 259,
		SUB = 260,
		MUL = 261,
		DIV = 262,
		ABS = 263,
		EOL = 264
	};
	int yylval;
%}

%%
"+"		{return ADD;}
"-"		{return SUB;}
"*"		{return MUL;}
"/"		{return DIV;}
"|"		{return ABS;}
[0-9]+	{yylval = atoi(yytext); return NUMBER;}
\n		{return EOL;}
[ \t]	{/* ignore */}
.		{printf("...")}
%%



%%
calalist:
	| calalist exp EOL {printf("= %d\n", $2);}
	;
exp: factor default $$ = $1
	| exp ADD factor {$$ = $1 + $3;}
	| exp SUB factor {$$ = $1 - $3;}
	;
	
factor: term default $$ = $1
	| factor MUL term {$$ = $1 * $3;}
	| factor DIV term {$$ = $1 / $3;}
	;
	
term: NUMBER default $$ = $1
	| ABS term {$$ = $2 >= 0? $2 : -$2; }
	;
%%
main(int args, char **argv) {
	yyparse();
}