#define MAX 5
int s[MAX],TOP = -1;
void push();
void pop();
void view();
main()
{
    int ch;
    do{
        printf("enter your choice \n 1.PUSH \n 2.POP \n 3.VIEW \n 4.EXIT");
        scanf("%d",&ch);
        switch(ch)
        {
            case 1:
            push();
            break;
            case 2:
            pop();
            break;
            case 3:
            view();
            break;
            case 4:
            exit(0);
            //exit is inbuilt function , 0 means failure 1 means successfull
            default:
            printf("wrong choice");
        }
    }
    while(ch!=4);

}
void push()
{
    int item;
    if(TOP == MAX-1)
    printf("Overfloww");
    else{
        printf("enter item");
        scanf("%d",&item);
        TOP++;
        s[TOP] = item;
    }
}
void pop()
{
    if(TOP == -1)
    printf("Underflow");
    else{
        printf("%d",s[TOP]);
        TOP--;

    }
}
void view()
{
    int index;
    for(index = TOP;index>=0;index--)
    printf("%d ",s[index]);
}
