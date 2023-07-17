#include <unistd.h>
 
int main(void) {
  char *binaryPath = 
#if defined(UBUNTU) || defined(DEBIAN)
  "/usr/sbin/apache2";
#endif
#if defined(CENTOS)
    "/usr/bin/systemctl";
#endif

  char *const args[] = { binaryPath, 
#if defined(UBUNTU) || defined(DEBIAN)
  "-k", "graceful", 
#endif
#if defined(CENTOS)
  "reload", "httpd.service",
#endif
  NULL};

  char *const env[] = {
#if defined(UBUNTU) || defined(DEBIAN)
		       "APACHE_RUN_DIR=/var/run/apache2",
		       "APACHE_LOG_DIR=/var/log/apache2",
		       "APACHE_LOCK_DIR=/var/lock/apache2",
		       "APACHE_PID_FILE=/var/run/apache2/apache2.pid",
		       "APACHE_RUN_USER=www-data",
		       "APACHE_RUN_GROUP=www-data",
#endif
		       NULL
  };
 
  execve(binaryPath, args, env);
 
  return 0;
}
