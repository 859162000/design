%{
#include "stdio.h"
%}

%%
\n						;
[0-9]+					printf("int:	%s\n",yytext);
[0-9]*\.[0-9]+			printf("float:	%s\n",yytext);
[a-zA-Z][a-zA-Z0-9]*	printf("var:	%s\n",yytext);
[\+\-\*\/\%]			printf("op:		%s\n",yytext);
.						printf("unknown	%c\n",yytext[0]);
%%