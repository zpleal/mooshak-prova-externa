DISTRO = $(shell cat /etc/os-release | egrep ^ID= | tr -d \" | cut -d = -f 2 | tr a-z A-Z)
CFLAGS = -D${DISTRO}
PROG   = restart

${PROG}: ${PROG}.c
	${CC} ${CFLAGS} -o ${PROG} ${PROG}.c
	chmod u+s ${PROG}

clean:
	rm ${PROG}